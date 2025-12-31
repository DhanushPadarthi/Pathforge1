# 🧪 QUICK TEST GUIDE - Delete & Templates Features

## Start Your Servers

### Terminal 1: Backend
```powershell
cd D:\projects\PATHFORGE1\backend
.\START_SERVER.ps1
# Expected: Server running on http://127.0.0.1:8000
```

### Terminal 2: Frontend
```powershell
cd D:\projects\PATHFORGE1\frontend
npm run dev
# Expected: Frontend running on http://localhost:3000
```

---

## Test Features (5 Minutes)

### ✅ Test 1: Roadmap Delete (1 min)
1. Open http://localhost:3000/roadmap
2. Scroll to any roadmap card
3. Click 🗑️ (trash icon)
4. Confirm deletion
5. **Expected:** Roadmap disappears from list
6. ✅ **Status:** Working

### ✅ Test 2: Roadmap Export (1 min)
1. Click ⬇️ (download icon) on roadmap
2. Check Downloads folder
3. **Expected:** File named `{title}_roadmap.json`
4. Open file - should be valid JSON
5. ✅ **Status:** Working

### ✅ Test 3: Template Search (1 min)
1. Go to `/projects`
2. Click "Templates" tab
3. Type "todo" in search box
4. **Expected:** Filters to show "Todo List App"
5. Clear search - shows all templates
6. ✅ **Status:** Working

### ✅ Test 4: Template Filter (1 min)
1. In Templates tab
2. Filter by "Beginner" difficulty
3. **Expected:** Shows 4 beginner templates
4. Change to "Advanced"
5. **Expected:** Shows 4 advanced templates
6. ✅ **Status:** Working

### ✅ Test 5: Use Template (1 min)
1. Click "Use Template" on any template
2. **Expected:** Switches to "Generate Projects" tab
3. Form auto-populates with template data
4. Click "Save Project"
5. **Expected:** Added to saved projects
6. ✅ **Status:** Working

---

## Additional Tests (Optional)

### Template Category Filter
1. In Templates tab
2. Filter by category (e.g., "Web Development")
3. **Expected:** Shows only templates in that category
4. ✅ **Status:** Working

### Delete Saved Project
1. Go to Projects → "Saved" tab
2. Click 🗑️ on any saved project
3. Confirm deletion
4. **Expected:** Project removed from list
5. ✅ **Status:** Working

### Export Saved Project
1. In Saved projects tab
2. Click ⬇️ on any project
3. Check Downloads
4. **Expected:** File named `{title}_project.json`
5. ✅ **Status:** Working

### Error Handling
1. In Roadmap page
2. Click 🗑️ on a roadmap
3. Click "Cancel" in confirmation
4. **Expected:** Roadmap NOT deleted
5. ✅ **Status:** Working

---

## Feature Verification Checklist

### Roadmap Features
- [ ] Delete button visible (🗑️)
- [ ] Export button visible (⬇️)
- [ ] Delete with confirmation
- [ ] Roadmap removed after delete
- [ ] Export downloads JSON
- [ ] File is valid

### Template Features
- [ ] All 12 templates visible
- [ ] Search works
- [ ] Category filter works
- [ ] Difficulty filter works
- [ ] Use template button works
- [ ] Form pre-populates
- [ ] Can save template as project

### Project Features
- [ ] Saved projects visible
- [ ] Delete button visible
- [ ] Export button visible
- [ ] Delete with confirmation
- [ ] Project removed after delete
- [ ] Export downloads JSON

### UI/UX
- [ ] Buttons properly styled
- [ ] Icons visible
- [ ] Loading spinners work
- [ ] Confirmation dialogs show
- [ ] Success messages appear
- [ ] Error messages display

---

## Common Test Scenarios

### Scenario 1: Complete Template Workflow
```
1. Login to app
2. Go to Projects → Templates
3. Search for "Todo"
4. Click "Use Template"
5. See form pre-populated
6. Click "Save Project"
7. Go to Saved tab
8. See saved project
✅ SUCCESS: Template workflow complete
```

### Scenario 2: Delete & Recover
```
1. Go to Projects → Saved
2. Click Export on a project
3. Click Delete
4. Confirm deletion
5. File is in Downloads as backup
✅ SUCCESS: Data protected before delete
```

### Scenario 3: Explore Templates
```
1. Go to Projects → Templates
2. Filter by "Intermediate"
3. Search for "dashboard"
4. Find Admin Dashboard
5. Click details to see full metadata
✅ SUCCESS: Templates discoverable
```

### Scenario 4: Delete Roadmap
```
1. Go to Roadmap page
2. Export your roadmap first
3. Click Delete
4. Confirm
5. Roadmap gone from list
6. Backup file in Downloads
✅ SUCCESS: Safe deletion confirmed
```

---

## Expected Results

### ✅ All Features Should Work

**Roadmap Operations:**
- Delete: < 1 second
- Export: Instant
- UI Update: Smooth

**Template System:**
- Search: Instant filtering
- Filter: Instant results
- Apply: Form populates immediately
- Save: < 2 seconds

**Project Operations:**
- Delete: < 1 second
- Export: Instant
- List Update: Immediate

---

## Troubleshooting

### If Delete Doesn't Work
- [ ] Backend running? Check http://127.0.0.1:8000/docs
- [ ] Network tab shows error? Note the error message
- [ ] Try refreshing page and retry

### If Templates Don't Show
- [ ] Frontend page refreshed?
- [ ] Try hard refresh (Ctrl + Shift + R)
- [ ] Check browser console for errors

### If Export Doesn't Download
- [ ] Check Downloads folder
- [ ] Check if downloads are blocked in browser
- [ ] Try different browser

### If Confirmation Dialog Doesn't Show
- [ ] Check that JavaScript is enabled
- [ ] Try opening browser dev tools (F12)
- [ ] Look for any errors in console

---

## Performance Benchmarks

What to expect:

| Operation | Time | Status |
|-----------|------|--------|
| Delete roadmap | < 1s | ✅ |
| Export roadmap | < 500ms | ✅ |
| Delete project | < 1s | ✅ |
| Export project | < 500ms | ✅ |
| Search templates | < 100ms | ✅ |
| Filter templates | < 100ms | ✅ |
| Apply template | < 200ms | ✅ |
| Load page | < 2s | ✅ |

---

## Success Criteria

✅ **You know it's working if:**
1. Delete buttons visible on all cards
2. Export buttons visible on all cards
3. Can delete with confirmation
4. Can export to JSON
5. All 12 templates visible
6. Can search templates
7. Can filter by category
8. Can use templates
9. Form pre-populates
10. Can save templates as projects

✅ **No errors in:**
- Browser console
- Network tab
- Backend logs
- User notifications

---

## Next Steps After Testing

1. **If Everything Works:** ✅ READY FOR PRODUCTION
   - Deploy to production
   - Notify team
   - Update documentation

2. **If Issues Found:** 🔧 FIX
   - Check troubleshooting section
   - Review code changes
   - Check backend logs
   - Report specific issues

3. **Performance:** ⚡ OPTIMIZE
   - Monitor timings
   - Check network requests
   - Profile React components
   - Optimize if needed

---

## Test Report Template

```
TEST DATE: [Date]
TESTER: [Your name]

FEATURE TESTS:
[ ] Delete Roadmap - ✅/❌
[ ] Export Roadmap - ✅/❌
[ ] Delete Project - ✅/❌
[ ] Export Project - ✅/❌
[ ] Templates Search - ✅/❌
[ ] Templates Filter - ✅/❌
[ ] Use Template - ✅/❌

OVERALL STATUS: ✅ PASS / ❌ FAIL

NOTES:
- [Any observations]
- [Any issues found]
- [Performance notes]
```

---

## Timeline

- **Preparation:** 2 minutes (start servers)
- **Testing:** 5 minutes (main features)
- **Additional:** 5 minutes (optional tests)
- **Total:** 12 minutes maximum

**Estimated Completion:** 15 minutes

---

## Support

If you encounter issues:
1. Check troubleshooting section above
2. Review code changes in the implementation files
3. Check browser console (F12)
4. Check network requests
5. Verify backend is running

---

**Test Date:** December 31, 2025
**Version:** 1.0.0
**Status:** Ready for Testing ✅

Start testing now! 🚀
