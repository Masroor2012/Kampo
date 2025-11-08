// loading animation time-out
setTimeout(() => {
    let anim = document.getElementById('loadAnim')
    anim.style.display = 'none'
    let pageHidden = document.getElementById('page-cont')
    pageHidden.style.display = 'block'
}, 5000)


//============================app-JS============================
document.addEventListener('DOMContentLoaded', () => {
  // Defensive helper
  const $ = id => document.getElementById(id);
  const safeText = (el, value) => { if(el) el.textContent = value; };

  // DOM refs (may be null-checked where needed)
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  const panels = Array.from(document.querySelectorAll('.panel'));
  const sidebar = $('sidebar');
  const hamburger = $('hamburger');

  const studentName = $('studentName');
  const studentClass = $('studentClass');
  const termSelect = $('termSelect');

  const subjectsTbody = $('subjectsTbody');
  const addSubjectBtn = $('addSubject');
  const calcBtn = $('calcBtn');

  const previewName = $('previewName');
  const previewMeta = $('previewMeta');
  const previewTbody = $('previewTbody');
  const previewTotal = $('previewTotal');
  const previewAvg = $('previewAvg');
  const previewGrade = $('previewGrade');
  const previewRemark = $('previewRemark');
  const previewTeacher = $('previewTeacher');
  const previewPrincipal = $('previewPrincipal');

  const themeToggle = $('themeToggle');
  const saveLocal = $('saveLocal');
  const loadLocal = $('loadLocal'); // optional (may be null in some UIs)
  const downloadPdf = $('downloadPdf');
  const exportJson = $('exportJson');
  const importJsonBtn = $('importJsonBtn');
  const importJsonFile = $('importJsonFile');
  const exportJsonMain = $('exportJsonMain');
  const importJsonMainBtn = $('importJsonMainBtn');
  const importJsonMainFile = $('importJsonMainFile');
  const clearAll = $('clearAll');
  const savedCount = $('savedCount');

  const gradingTbody = $('gradingTbody');
  const addGradeRow = $('addGradeRow');
  const resetGuide = $('resetGuide');

  // NAV
  navBtns.forEach(btn => btn.addEventListener('click', () => {
    try {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panels.forEach(p => p.classList.remove('active'));
      const tgt = btn.dataset.target;
      const panel = document.getElementById(tgt);
      if (panel) panel.classList.add('active');
      if (window.innerWidth <= 960 && sidebar) sidebar.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) { console.error(e); alert('Navigation error: ' + e.message); }
  }));

  // Card shortcuts
  const pushNav = selector => {
    const el = document.querySelector(selector);
    if (el) el.click();
  };
  ['card-saved','card-generator','card-grading','card-settings'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => {
      const map = { 'card-saved':'panel-settings','card-generator':'panel-generator','card-grading':'panel-grading','card-settings':'panel-settings' };
      const target = map[id];
      const btn = document.querySelector(`.nav-btn[data-target="${target}"]`);
      if (btn) btn.click();
    });
  });

  // Hamburger for mobile
  if (hamburger) {
    hamburger.style.display = window.innerWidth <= 960 ? 'inline-block' : 'none';
    hamburger.addEventListener('click', () => sidebar && sidebar.classList.toggle('hidden'));
    window.addEventListener('resize', () => {
      if (hamburger) hamburger.style.display = window.innerWidth <= 960 ? 'inline-block' : 'none';
      if (window.innerWidth > 960 && sidebar) sidebar.classList.remove('hidden');
    });
  }

  // Grading guide helpers
  function addGrade(min='', max='', grade='', remark='') {
    if (!gradingTbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="number" value="${min}" style="width:80px"></td>
      <td><input type="number" value="${max}" style="width:80px"></td>
      <td><input value="${grade}" style="width:80px"></td>
      <td><input value="${remark}" style="width:160px"></td>
      <td><button class="btn ghost" onclick="this.closest('tr').remove()">Remove</button></td>
    `;
    gradingTbody.appendChild(tr);
  }
  function loadDefaultGuide() {
    if (!gradingTbody) return;
    gradingTbody.innerHTML = '';
    [[80,100,'A','Excellent'],[70,79,'B','Very Good'],[60,69,'C','Good'],[50,59,'D','Pass'],[0,49,'F','Fail']].forEach(g => addGrade(...g));
  }
  if (addGradeRow) addGradeRow.addEventListener('click', () => addGrade(0,0,'',''));
  if (resetGuide) resetGuide.addEventListener('click', loadDefaultGuide);
  loadDefaultGuide();

  // Subjects
  function addSubjectRow(name='', max=100, obtained=0, remark='') {
    if (!subjectsTbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:left"><input class="sub-name" value="${escapeHtmlAttr(name)}" style="width:100%"/></td>
      <td><input type="number" class="sub-max" value="${max}" style="width:90px"/></td>
      <td><input type="number" class="sub-obt" value="${obtained}" style="width:90px"/></td>
      <td><input class="sub-remark" value="${escapeHtmlAttr(remark)}" readonly style="width:140px"/></td>
      <td><button class="btn ghost" onclick="this.closest('tr').remove()">Remove</button></td>
    `;
    subjectsTbody.appendChild(tr);
  }
  if (addSubjectBtn) addSubjectBtn.addEventListener('click', () => addSubjectRow());
  ['English','Mathematics','Biology','Chemistry','Physics','Civic'].forEach(s => addSubjectRow(s,100,0,''));

  // Grade helpers
  function readGuide() {
    if (!gradingTbody) return [];
    return Array.from(gradingTbody.querySelectorAll('tr')).map(r => ({
      min: Number(r.children[0].querySelector('input').value) || 0,
      max: Number(r.children[1].querySelector('input').value) || 100,
      grade: r.children[2].querySelector('input').value || '-',
      remark: r.children[3].querySelector('input').value || '-'
    }));
  }
  function findGrade(pct) {
    const guide = readGuide();
    for (const g of guide) if (pct >= g.min && pct <= g.max) return g;
    return { grade: '-', remark: '-' };
  }
  function generateAutoComment(pct) {
    if (pct >= 80) return { teacher: 'Excellent performance! Keep it up.', principal: 'Outstanding! Continue with this great performance.' };
    if (pct >= 70) return { teacher: 'Very good result. You can still aim higher.', principal: 'Good effort! Keep working hard.' };
    if (pct >= 60) return { teacher: 'Good performance. Try to improve further.', principal: 'Satisfactory. More focus needed for better results.' };
    if (pct >= 50) return { teacher: 'Fair result. Needs more dedication.', principal: 'Average performance. Encourage more study.' };
    return { teacher: 'Needs serious improvement.', principal: 'Below expectation. Must work harder.' };
  }

  // Calculate & render
  function calculate() {
    try {
      if (!subjectsTbody || !previewTbody) return;
      const rows = Array.from(subjectsTbody.querySelectorAll('tr'));
      previewTbody.innerHTML = '';
      let totalObt = 0, totalMax = 0;
      rows.forEach(r => {
        const name = (r.querySelector('.sub-name') && r.querySelector('.sub-name').value) || '—';
        const max = Number((r.querySelector('.sub-max') && r.querySelector('.sub-max').value) || 0);
        const obt = Number((r.querySelector('.sub-obt') && r.querySelector('.sub-obt').value) || 0);
        const pct = max ? Math.round((obt / max) * 100) : 0;
        const gr = findGrade(pct);
        const remarkInput = r.querySelector('.sub-remark');
        if (remarkInput) remarkInput.value = gr.remark;
        totalObt += obt; totalMax += max;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="text-align:left">${escapeHtml(name)}</td><td>${max}</td><td>${obt}</td><td>${pct}%</td><td>${escapeHtml(gr.grade)}</td><td>${escapeHtml(gr.remark)}</td>`;
        previewTbody.appendChild(tr);
      });
      const subjCount = rows.length || 1;
      const avg = subjCount ? (totalObt / subjCount) : 0;
      const overallPct = totalMax ? Math.round((totalObt / totalMax) * 100) : 0;
      const overall = findGrade(overallPct);

      safeText(previewName, studentName && studentName.value ? studentName.value : 'Student Name');
      safeText(previewMeta, `${studentClass && studentClass.value ? studentClass.value : '-'} • ${termSelect && termSelect.value ? termSelect.value : ''}`);
      safeText(previewTotal, `${totalObt}/${totalMax}`);
      safeText(previewAvg, avg.toFixed(2));
      safeText(previewGrade, overall.grade);
      safeText(previewRemark, overall.remark);

      const auto = generateAutoComment(overallPct);
      if (previewTeacher && previewTeacher.dataset.userEdited !== '1') previewTeacher.textContent = auto.teacher;
      if (previewPrincipal && previewPrincipal.dataset.userEdited !== '1') previewPrincipal.textContent = auto.principal;
    } catch (e) {
      console.error('Calculate error', e);
      alert('Calculate error: ' + e.message);
    }
  }
  if (calcBtn) calcBtn.addEventListener('click', calculate);

  if (previewTeacher) previewTeacher.addEventListener('input', () => previewTeacher.dataset.userEdited = '1');
  if (previewPrincipal) previewPrincipal.addEventListener('input', () => previewPrincipal.dataset.userEdited = '1');

  // PDF export
  if (downloadPdf) downloadPdf.addEventListener('click', () => {
    try {
      calculate();
      if (!$('reportPreview')) { alert('Preview element missing'); return; }
      const element = $('reportPreview');
      const name = (studentName && studentName.value ? studentName.value : 'report').replace(/\s+/g, '_');
      const teacherAttr = previewTeacher && previewTeacher.getAttribute('contenteditable');
      const principalAttr = previewPrincipal && previewPrincipal.getAttribute('contenteditable');
      if (previewTeacher) previewTeacher.removeAttribute('contenteditable');
      if (previewPrincipal) previewPrincipal.removeAttribute('contenteditable');

      const opt = { margin: 0.2, filename: `${name}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } };
      html2pdf().set(opt).from(element).save().then(() => {
        if (previewTeacher && teacherAttr !== null) previewTeacher.setAttribute('contenteditable', teacherAttr);
        if (previewPrincipal && principalAttr !== null) previewPrincipal.setAttribute('contenteditable', principalAttr);
      }).catch(err => {
        if (previewTeacher && teacherAttr !== null) previewTeacher.setAttribute('contenteditable', teacherAttr);
        if (previewPrincipal && principalAttr !== null) previewPrincipal.setAttribute('contenteditable', principalAttr);
        console.error('PDF error', err);
        alert('PDF export failed: ' + (err && err.message ? err.message : err));
      });
    } catch (e) { console.error(e); alert('PDF error: ' + e.message); }
  });

  // Theme toggle
  function setTheme(t) {
    document.body.setAttribute('data-theme', t);
    localStorage.setItem('rc_theme', t);
    if (themeToggle) themeToggle.textContent = t === 'dark' ? ' Light theme' : 'Dark theme';
  }
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const cur = document.body.getAttribute('data-theme') || 'light';
    setTheme(cur === 'light' ? 'dark' : 'light');
  });
  // init theme
  (function(){ try { const saved = localStorage.getItem('rc_theme') || 'light'; setTheme(saved); } catch(e){ console.error(e); } })();

  // Local storage: save/load/export/import/clear
  const STORAGE_KEY = 'rc_reports_final_v1';
  function updateSavedCount() {
    try {
      const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      safeText(savedCount, `${arr.length} saved`);
    } catch (e) { console.error(e); safeText(savedCount, '0 saved'); }
  }
  async function collectCurrentReport() {
    const subjects = Array.from((subjectsTbody && subjectsTbody.querySelectorAll('tr')) || []).map(r => ({
      name: (r.querySelector('.sub-name') && r.querySelector('.sub-name').value) || '',
      max: Number((r.querySelector('.sub-max') && r.querySelector('.sub-max').value) || 0),
      obtained: Number((r.querySelector('.sub-obt') && r.querySelector('.sub-obt').value) || 0),
      remark: (r.querySelector('.sub-remark') && r.querySelector('.sub-remark').value) || ''
    }));
    return {
      meta: { name: studentName && studentName.value, class: studentClass && studentClass.value, term: termSelect && termSelect.value },
      subjects,
      gradingGuide: readGuide(),
      teacherComment: previewTeacher && previewTeacher.textContent || '',
      principalComment: previewPrincipal && previewPrincipal.textContent || '',
      created: new Date().toISOString()
    };
  }

  if (saveLocal) saveLocal.addEventListener('click', async () => {
    try {
      const data = await collectCurrentReport();
      const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      arr.push(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      updateSavedCount();
      alert('Saved locally.');
    } catch (e) { console.error(e); alert('Save failed: ' + e.message); }
  });

  if (loadLocal) loadLocal.addEventListener('click', () => {
    try {
      const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!arr.length) { alert('No saved reports'); return; }
      const data = arr[arr.length - 1];
      // restore
      if (studentName) studentName.value = data.meta && data.meta.name || '';
      if (studentClass) studentClass.value = data.meta && data.meta.class || '';
      if (termSelect) termSelect.value = data.meta && data.meta.term || 'First Term';
      if (subjectsTbody) { subjectsTbody.innerHTML = ''; (data.subjects || []).forEach(s => addSubjectRow(s.name, s.max, s.obtained, s.remark)); }
      if (gradingTbody && data.gradingGuide && data.gradingGuide.length) { gradingTbody.innerHTML = ''; data.gradingGuide.forEach(g => addGrade(g.min, g.max, g.grade, g.remark)); }
      if (previewTeacher) previewTeacher.textContent = data.teacherComment || previewTeacher.textContent;
      if (previewPrincipal) previewPrincipal.textContent = data.principalComment || previewPrincipal.textContent;
      if (previewTeacher) previewTeacher.dataset.userEdited = '1';
      if (previewPrincipal) previewPrincipal.dataset.userEdited = '1';
      calculate();
      alert('Loaded most recent saved report.');
    } catch (e) { console.error(e); alert('Load failed: ' + e.message); }
  });

  if (exportJson) exportJson.addEventListener('click', () => {
    try {
      const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const blob = new Blob([JSON.stringify(arr, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'rc_reports_backup.json'; a.click(); a.remove();
    } catch (e) { console.error(e); alert('Export failed: ' + e.message); }
  });
  if (exportJsonMain) exportJsonMain.addEventListener('click', () => exportJson && exportJson.click());
  if (importJsonBtn) importJsonBtn.addEventListener('click', () => importJsonFile && importJsonFile.click());
  if (importJsonMainBtn) importJsonMainBtn.addEventListener('click', () => importJsonMainFile && importJsonMainFile.click());

  if (importJsonFile) importJsonFile.addEventListener('change', async (e) => {
    try {
      const f = e.target.files[0]; if (!f) { alert('No file selected'); return; }
      const text = await f.text();
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) throw new Error('Invalid format');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      updateSavedCount();
      alert('Imported backup.');
    } catch (err) { console.error(err); alert('Import failed: ' + (err && err.message ? err.message : err)); }
  });

  if (importJsonMainFile) importJsonMainFile.addEventListener('change', async (e) => {
    try {
      const f = e.target.files[0]; if (!f) { alert('No file selected'); return; }
      const text = await f.text();
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) throw new Error('Invalid format');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      updateSavedCount();
      alert('Imported backup.');
    } catch (err) { console.error(err); alert('Import failed: ' + (err && err.message ? err.message : err)); }
  });

  if (clearAll) clearAll.addEventListener('click', () => {
    if (!confirm('Clear all local data? This removes saved reports and theme.')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('rc_theme');
    updateSavedCount();
    alert('Cleared.');
  });

  updateSavedCount();

  // Small utilities
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function escapeHtmlAttr(s) { return escapeHtml(s).replace(/"/g,'&quot;'); }

  // Expose helpers for inline buttons
  window.addGrade = addGrade;
  window.addSubjectRow = addSubjectRow;
});
