import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';

test('CMS persists migrated content, enforces authentication, and exports only public records', async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'dad-cms-test-'));
  const env = {...process.env, CMS_DATA_DIR:temporary, PORT:'4317', CMS_ADMIN_EMAIL:'test@example.invalid',CMS_ADMIN_PASSWORD:'local-test-'+crypto.randomUUID()};
  const run = spawnSync(process.execPath,['--import','tsx','scripts/create-admin.ts'],{env,encoding:'utf8'});
  assert.equal(run.status,0,run.stderr);
  let server = spawn(process.execPath,['--import','tsx','server.ts'],{env,stdio:['ignore','pipe','pipe']});
  let logs=''; server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
  const waitReady=async()=>{for(let i=0;i<150;i++){try{if((await fetch('http://127.0.0.1:4317/api/public/bootstrap')).ok)return;}catch{} await new Promise(r=>setTimeout(r,100));}throw Error(logs);};
  try {
    await waitReady();
    const base='http://127.0.0.1:4317';
    let pub=await (await fetch(base+'/api/public/bootstrap')).json();
    assert.equal(pub.profile.piName,'Dr. Dharmendra Saraswat');
    assert.equal(pub.profile.researchAreas.length,6);
    assert.equal(pub.profile.piPortraitUrl,'/images/people/principal-investigator/dharmendra-saraswat.jpg');
    assert.equal(pub.allPublications.length,80);
    assert.equal(pub.courses.length,4);
    assert.deepEqual(pub.courses.filter((c:any)=>c.status==='active').map((c:any)=>c.title),['Geographic Information System Application','Data Visualization and Edge Computing']);
    assert.equal(pub.profile.heroEyebrow,'');assert.equal(pub.profile.reviewNote,'');
    assert.equal(pub.profile.piAwards.length,37);assert.equal(pub.profile.piHonors.length,37);
    assert.equal(pub.opportunities.length,0);
    assert.equal(pub.allProjects.length,16);
    assert.ok(pub.allProjects.every((p:any)=>['ongoing','completed'].includes(p.project_status) && p.topics.length>0));
    assert.deepEqual(pub.allProjects.slice(0,3).map((p:any)=>p.project_status),['ongoing','ongoing','ongoing']);
    assert.equal(pub.featuredProjects.length,3);
    assert.ok(pub.allNews.every((n:any)=>['published','archived'].includes(n.status) && /^\d{4}(-\d{2}-\d{2})?$/.test(n.published_date)));
    assert.equal(pub.featuredNews.length,3);
    assert.equal((await fetch(base+'/api/admin/workspace')).status,401);
    const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:env.CMS_ADMIN_EMAIL,password:env.CMS_ADMIN_PASSWORD})});
    assert.equal(login.status,200);const cookie=login.headers.get('set-cookie')!.split(';')[0];
    const request=(url:string,method='GET',body?:unknown)=>fetch(base+url,{method,headers:{'Content-Type':'application/json',Cookie:cookie},body:body?JSON.stringify(body):undefined});
    const workspace=await (await request('/api/admin/workspace')).json();
    assert.equal(workspace.courses.length,8);assert.equal(workspace.courses.filter((c:any)=>c.status==='draft').length,4);
    const draft=await (await request('/api/admin/news','POST',{title:'Private draft',status:'draft',source_url:'https://example.org/source',attachments:[{label:'Paper',url:'https://example.org/paper.pdf'}],content_html:'<p>Safe</p><img src=x onerror=alert(1)><script>alert(1)</script>'})).json();
    assert.ok(!draft.content_html.includes('onerror') && !draft.content_html.includes('<script'));
    assert.equal(draft.source_url,'https://example.org/source');
    const changed={...pub.profile,teachingOverview:'Edited educational activities',researchAreas:[{id:'new-area',title:'Reviewed research',description:'Updated in CMS',imageUrl:''}]};
    assert.equal((await request('/api/admin/profile','PUT',changed)).status,200);
    assert.equal((await request('/api/admin/projects/'+pub.allProjects[0].id,'PUT',{project_status:'completed'})).status,200);
    assert.equal((await request('/api/admin/projects/'+pub.allProjects[0].id,'PUT',{project_status:'paused'})).status,400);
    const retagged=await (await request('/api/admin/projects/'+pub.allProjects[1].id,'PUT',{topics:['area-4','area-4','area-5']})).json();
    assert.deepEqual(retagged.topics,['area-4','area-5']);
    const created=await (await request('/api/admin/projects','POST',{title:'New topic project',research_area:'Environmental and Watershed Modeling',topics:['area-4'],project_status:'ongoing'})).json();
    assert.deepEqual(created.topics,['area-4']);
    const exported=await (await request('/api/admin/public-export')).json();
    assert.ok(!('users' in exported) && !('inquiries' in exported));assert.ok(!JSON.stringify(exported).includes('Private draft'));
    const backup=await (await request('/api/admin/backup/export')).json();
    assert.equal((await request('/api/admin/backup/restore','POST',backup)).status,200);
    const restored=await (await request('/api/admin/workspace')).json();
    assert.equal(restored.news.find((n:any)=>n.id===draft.id).attachments[0].url,'https://example.org/paper.pdf');
    server.kill();await once(server,'exit');
    server=spawn(process.execPath,['--import','tsx','server.ts'],{env,stdio:['ignore','pipe','pipe']});
    server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
    await waitReady();
    pub=await (await fetch(base+'/api/public/bootstrap')).json();
    assert.equal(pub.profile.teachingOverview,'Edited educational activities');
    assert.equal(pub.profile.researchAreas[0].title,'Reviewed research');
    assert.equal(pub.profile.piAwards.length,37,'awards survive profile edits, backup restore, and restart');
    assert.equal(pub.allProjects.find((p:any)=>p.id===exported.allProjects[0].id)?.project_status,exported.allProjects[0].project_status);
    assert.deepEqual(pub.allProjects.find((p:any)=>p.id===retagged.id)?.topics,['area-4','area-5'],'topics survive backup restore and restart');
  } finally {
    server.kill(); if(server.exitCode===null) await once(server,'exit');
    fs.rmSync(temporary,{recursive:true,force:true});
  }
});

test('existing project schema migrates to archived status and topics without losing records', () => {
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'dad-schema-test-'));
  try {
    const result=spawnSync(process.execPath,['--import','tsx','--input-type=module','-e',`
      import fs from 'node:fs';
      import path from 'node:path';
      import { DatabaseSync } from 'node:sqlite';
      import assert from 'node:assert/strict';
      const raw=new DatabaseSync(path.join(process.env.CMS_DATA_DIR,'purdue_lab_cms.db'));
      const source=fs.readFileSync('server/db.ts','utf8');
      const schema=source.match(/CREATE TABLE IF NOT EXISTS projects \\([\\s\\S]*?\\n    \\);/)[0].replace(", 'archived'",'').replace(/\\n\\s*topics_json[^\\n]*/,'');
      assert.ok(!schema.includes('topics_json'));
      raw.exec(schema);
      const {initialRecords}=await import('./server/initial-content.ts');
      const {topics_json,...legacy}=initialRecords.projects[0];
      const row={...legacy,id:99,slug:'preserved-project',project_status:'completed',created_at:'2020',updated_at:'2020'};
      raw.prepare('INSERT INTO projects ('+Object.keys(row).join(',')+') VALUES ('+Object.keys(row).map(()=>'?').join(',')+')').run(...Object.values(row));
      raw.close();
      const {db,initDb}=await import('./server/db.ts');initDb();
      assert.equal(db.prepare('SELECT slug FROM projects WHERE id=99').get().slug,'preserved-project');
      assert.equal(db.prepare('SELECT topics_json FROM projects WHERE id=99').get().topics_json,'[]');
      db.prepare("UPDATE projects SET project_status='archived' WHERE id=99").run();
      db.exec('DELETE FROM publications WHERE id=1'); initDb();
      assert.equal(db.prepare('SELECT id FROM publications WHERE id=1').get(),undefined);
      assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
      db.close();
    `],{env:{...process.env,CMS_DATA_DIR:temporary},encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
  } finally {fs.rmSync(temporary,{recursive:true,force:true});}
});

test('Pages build uses reviewed public snapshot rather than local database', () => {
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'dad-pages-export-'));
  try {
    fs.mkdirSync(path.join(temporary,'content'));fs.mkdirSync(path.join(temporary,'dist'));
    const input={profile:{labName:'Reviewed lab'},featuredProjects:[],allProjects:[],featuredNews:[],allNews:[],featuredPublications:[],allPublications:[],courses:[],opportunities:[],users:['private'],inquiries:['private']};
    fs.writeFileSync(path.join(temporary,'content/public-data.json'),JSON.stringify(input));
    const result=spawnSync(process.execPath,['--import',path.resolve('node_modules/tsx/dist/loader.mjs'),path.resolve('scripts/export-public.ts')],{cwd:temporary,encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
    const exported=JSON.parse(fs.readFileSync(path.join(temporary,'dist/public-data.json'),'utf8'));
    assert.equal(exported.profile.labName,'Reviewed lab');assert.ok(!('users' in exported));assert.ok(!('inquiries' in exported));
  }finally{fs.rmSync(temporary,{recursive:true,force:true});}
});
