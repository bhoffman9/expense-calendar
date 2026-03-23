import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Trash2, Check, GripVertical, Download, Search, X, Archive, FolderOpen, Eye, Plus, StickyNote, ArrowUpDown } from 'lucide-react';

const ExpenseCalendar = () => {
  const initialExpenses = [
    { name: "PARKING LOT", amount: 3100.00, day: 10, account: "IOTH SF", id: "exp-1" },
    { name: "TCI", amount: 4000.00, day: 10, account: "IOTH SF", id: "exp-2" },
    { name: "ASCEND", amount: 1902.63, day: 12, account: "AUTO SF", id: "exp-3" },
    { name: "NEVADA UNEMPLOYMENT TAX", amount: 3363.03, day: 12, account: "AUTO SF", id: "exp-4" },
    { name: "LVWD", amount: 375.00, day: 14, account: "AUTO CE", id: "exp-5" },
    { name: "STORAGE ON WHEELS", amount: 271.00, day: 14, account: "AUTO SF", id: "exp-7" },
    { name: "PENSKE", amount: 7500.00, day: 10, account: "AUTO SF", id: "exp-8" },
    { name: "SYLECTUS", amount: 450.00, day: 15, account: "AUTO CE", id: "exp-9" },
    { name: "TEC", amount: 37000.00, day: 15, account: "SF", id: "exp-10" },
    { name: "WELLS FARGO FORKLIFT", amount: 1228.83, day: 15, account: "AUTO DOCKKT", id: "exp-11" },
    { name: "2025 CADILLAC", amount: 2100.00, day: 18, account: "AUTO J&A", id: "exp-12" },
    { name: "COX", amount: 844.69, day: 18, account: "AUTO SF", id: "exp-13" },
    { name: "DAT", amount: 1480.00, day: 18, account: "AUTO SF", id: "exp-14" },
    { name: "MANHATTAN LIFE", amount: 1400.00, day: 18, account: "SF", id: "exp-15" },
    { name: "VERIZON", amount: 508.30, day: 18, account: "AUTO J&A - CHRIS", id: "exp-16" },
    { name: "NV ENERGY", amount: 1000.00, day: 22, account: "CE - OFFICE", id: "exp-17" },
    { name: "GOOGLE ADS", amount: 220.00, day: 1, account: "AUTO CE", id: "exp-19" },
    { name: "GOOGLE GSUITE", amount: 230.42, day: 1, account: "AUTO CE", id: "exp-20" },
    { name: "GREEN VALLEY STORAGE", amount: 290.00, day: 1, account: "AUTO J&A - CHRIS", id: "exp-21" },
    { name: "SAMSARA", amount: 1533.88, day: 1, account: "AUTO SF", id: "exp-22" },
    { name: "UNIFIRST", amount: 900.00, day: 1, account: "AUTO SF", id: "exp-23" },
    { name: "XTRA", amount: 3000.00, day: 20, account: "AUTO J&A", id: "exp-24" },
    { name: "IFAX", amount: 19.99, day: 21, account: "AUTO CE", id: "exp-25" },
    { name: "SWGAS - RUBY SKY", amount: 100.00, day: 28, account: "CE - CHRIS", id: "exp-26" },
    { name: "SWGAS - MANDALAY", amount: 1200.00, day: 28, account: "CE - CHRIS", id: "exp-27" },
    { name: "ASCEND", amount: 1085.00, day: 23, account: "AUTO CE", id: "exp-28" },
    { name: "NV ENERGY - RUBY SKY", amount: 800.00, day: 20, account: "CE - CHRIS", id: "exp-29" },
    { name: "NV ENERGY - MANDALAY", amount: 800.00, day: 20, account: "CE - CHRIS", id: "exp-30" },
    { name: "STARLINK", amount: 232.00, day: 23, account: "AUTO J&A", id: "exp-31" },
    { name: "DESCARTES", amount: 570.00, day: 25, account: "AUTO WIRE SF", id: "exp-32" },
    { name: "TEC", amount: 4000.00, day: 25, account: "AUTO SF", id: "exp-33" },
    { name: "WORKERS COMP - SF", amount: 5000.00, day: 25, account: "SF", id: "exp-34" },
    { name: "RYDER TRUCKS", amount: 2500.00, day: 25, account: "AUTO SF", id: "exp-46" },
    { name: "NIS GENERAL LIABILITY", amount: 427.00, day: 28, account: "AUTO CE", id: "exp-35" },
    { name: "CARRIER RISK SOLUTIONS", amount: 1000.00, day: 28, account: "SF", id: "exp-36" },
    { name: "MOTOROLA", amount: 2199.50, day: 28, account: "AUTO SF", id: "exp-37" },
    { name: "MCKINNEY", amount: 6000.00, day: 31, account: "SF", id: "exp-38" },
    { name: "MYCARRIER PORTAL", amount: 655.00, day: 3, account: "AUTO WIRE SF", id: "exp-39" },
    { name: "PROGRESSIVE", amount: 599.46, day: 4, account: "AUTO CE", id: "exp-40" },
    { name: "ANTHEM", amount: 4494.97, day: 9, account: "AUTO J&A", id: "exp-41" },
    { name: "CAPITAL GROUP BENEFITS", amount: 1300.00, day: 9, account: "AUTO SF", id: "exp-42" },
    { name: "SETTLEMENT", amount: 6500.00, day: 1, account: "WIRE SYLVESTER & POLEDNAK", id: "exp-44" }
  ];

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [expenses, setExpenses] = useState(initialExpenses);
  const [checkedItems, setCheckedItems] = useState({});
  const [deletedItems, setDeletedItems] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAmount, setEditingAmount] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [archivedMonths, setArchivedMonths] = useState({});
  const [viewingArchive, setViewingArchive] = useState(null);
  const [showArchiveList, setShowArchiveList] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpenseForm, setNewExpenseForm] = useState({
    name: '', amount: '', account: '', isRecurring: false,
    recurType: 'monthly-date', recurDay: '', recurMonth: '',
    oneTimeDay: '', oneTimeMonth: currentMonth, oneTimeYear: currentYear
  });

  // NEW STATE
  const [notes, setNotes] = useState({});
  const [openNotes, setOpenNotes] = useState({});
  const [editingAccount, setEditingAccount] = useState(null);
  const [editAccountValue, setEditAccountValue] = useState('');
  const [daySort, setDaySort] = useState('default'); // 'default' | 'amount-desc' | 'amount-asc' | 'unchecked-first'
  const [customRecurring, setCustomRecurring] = useState([]); // user-added recurring patterns

  // Load saved data on mount
  React.useEffect(() => {
    const loadData = () => {
      try {
        const expensesData = localStorage.getItem('ec-expenses-data');
        const checkedData = localStorage.getItem('ec-checked-items');
        const deletedData = localStorage.getItem('ec-deleted-items');
        const archivesData = localStorage.getItem('ec-archived-months');
        const notesData = localStorage.getItem('ec-expense-notes');

        if (expensesData) setExpenses(JSON.parse(expensesData));
        if (checkedData) setCheckedItems(JSON.parse(checkedData));
        if (deletedData) setDeletedItems(JSON.parse(deletedData));
        if (archivesData) setArchivedMonths(JSON.parse(archivesData));
        if (notesData) setNotes(JSON.parse(notesData));
        const recurData = localStorage.getItem('ec-custom-recurring');
        if (recurData) setCustomRecurring(JSON.parse(recurData));
      } catch (error) {
        console.log('No saved data found or error loading:', error);
      }
    };
    loadData();
  }, []);

  // Auto-save
  React.useEffect(() => {
    const saveData = () => {
      if (viewingArchive) return;
      setSaveStatus('saving');
      try {
        localStorage.setItem('ec-expenses-data', JSON.stringify(expenses));
        localStorage.setItem('ec-checked-items', JSON.stringify(checkedItems));
        localStorage.setItem('ec-deleted-items', JSON.stringify(deletedItems));
        localStorage.setItem('ec-archived-months', JSON.stringify(archivedMonths));
        localStorage.setItem('ec-expense-notes', JSON.stringify(notes));
        localStorage.setItem('ec-custom-recurring', JSON.stringify(customRecurring));
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error saving data:', error);
        setSaveStatus('error');
      }
    };
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [expenses, checkedItems, deletedItems, archivedMonths, notes, customRecurring, viewingArchive]);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const bankHolidays = {
    2025: [
      { month: 0, day: 1, name: "New Year's Day" },{ month: 0, day: 20, name: "MLK Jr. Day" },
      { month: 1, day: 17, name: "Presidents' Day" },{ month: 4, day: 26, name: "Memorial Day" },
      { month: 5, day: 19, name: "Juneteenth" },{ month: 6, day: 4, name: "Independence Day" },
      { month: 8, day: 1, name: "Labor Day" },{ month: 9, day: 13, name: "Columbus Day" },
      { month: 10, day: 11, name: "Veterans Day" },{ month: 10, day: 27, name: "Thanksgiving" },
      { month: 11, day: 25, name: "Christmas" }
    ],
    2026: [
      { month: 0, day: 1, name: "New Year's Day" },{ month: 0, day: 19, name: "MLK Jr. Day" },
      { month: 1, day: 16, name: "Presidents' Day" },{ month: 4, day: 25, name: "Memorial Day" },
      { month: 5, day: 19, name: "Juneteenth" },{ month: 6, day: 3, name: "Independence Day" },
      { month: 8, day: 7, name: "Labor Day" },{ month: 9, day: 12, name: "Columbus Day" },
      { month: 10, day: 11, name: "Veterans Day" },{ month: 10, day: 26, name: "Thanksgiving" },
      { month: 11, day: 25, name: "Christmas" }
    ]
  };

  const getDayOfWeek = (day, month, year) => new Date(year, month, day).getDay();
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const isBankHoliday = (day, month, year) => {
    const holidays = bankHolidays[year] || [];
    return holidays.find(h => h.month === month && h.day === day);
  };

  // DUE SOON logic
  const isDueSoon = (day) => {
    const today = new Date();
    const isCurrentMonthYear = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    if (!isCurrentMonthYear) return false;
    const todayDay = today.getDate();
    return day > todayDay && day <= todayDay + 3;
  };

  const isOverdue = (day) => {
    const today = new Date();
    const isCurrentMonthYear = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    if (!isCurrentMonthYear) return false;
    return day < today.getDate();
  };

  const getItemKey = (item, date) => item.id ? item.id : `${date}-${item.name}-${item.amount}`;

  const toggleCheck = (key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const deleteItem = (key) => {
    setDeletedItems(prev => ({ ...prev, [key]: true }));
  };

  // BULK CHECK: check/uncheck all items for a day
  const bulkCheckDay = (day) => {
    const dayExpenses = getExpensesForDay(day);
    const allKeys = dayExpenses.map(exp => getItemKey(exp, `${currentYear}-${currentMonth}-${day}`));
    const allChecked = allKeys.every(k => checkedItems[k]);
    const update = {};
    allKeys.forEach(k => { update[k] = !allChecked; });
    setCheckedItems(prev => ({ ...prev, ...update }));
  };

  const handleDragStart = (e, expense, day) => {
    setDraggedItem({ expense, fromDay: day });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, day) => {
    if (viewingArchive) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDay(day);
  };

  const handleDragLeave = () => setDragOverDay(null);

  const handleDrop = (e, toDay) => {
    e.preventDefault();
    setDragOverDay(null);
    if (!draggedItem || viewingArchive) return;
    const { expense, fromDay } = draggedItem;
    if (fromDay !== toDay) {
      if (expense.isRecurring) {
        const newExpense = {
          name: expense.name, amount: expense.amount, account: expense.account,
          day: toDay, isRecurring: false,
          month: currentMonth, year: currentYear,  // lock to this month only
          id: `moved-${Date.now()}-${Math.random()}`
        };
        setExpenses(prev => [...prev, newExpense]);
        const itemKey = getItemKey(expense, `${currentYear}-${currentMonth}-${fromDay}`);
        deleteItem(itemKey);
      } else {
        setExpenses(prev => prev.map(exp => exp.id === expense.id ? { ...exp, day: toDay } : exp));
      }
    }
    setDraggedItem(null);
  };

  const getWeekdays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, dayOfWeek: getDayOfWeek(day, currentMonth, currentYear) });
    }
    return days;
  };

  const getExpensesForDay = (day) => {
    const baseExpenses = expenses.filter(exp => exp.day === day);
    const dayOfWeek = getDayOfWeek(day, currentMonth, currentYear);
    const allExpenses = [...baseExpenses];

    if (day === 1) allExpenses.push({ name: "⏰ REMINDER: BILL GOFO", amount: 0, account: "REMINDER", isRecurring: true, id: `rec-1st-gofo-reminder-${day}` });
    if (day === 4) allExpenses.push({ name: "SWGAS - OFFICE", amount: 100.00, account: "AUTO CE", isRecurring: true, id: `rec-4th-swgas-${day}` });
    if (day === 3) allExpenses.push({ name: "CENTRAL DISPATCH", amount: 199.95, account: "AUTO CE", isRecurring: true, id: `rec-3rd-centraldispatch-${day}` });
    if (day === 12) allExpenses.push({ name: "BOA RANGE ROVER", amount: 2025.49, account: "AUTO CE", isRecurring: true, id: `rec-12th-boa-${day}` });
    if (day === 14) allExpenses.push({ name: "MBFS", amount: 1287.92, account: "AUTO SF", isRecurring: true, id: `rec-14th-mbfs-${day}` });
    if (day === 15) {
      allExpenses.push({ name: "NELLY'S PAYROLL", amount: 1000.00, account: "AUTO CE", isRecurring: true, id: `rec-15th-nelly-${day}` });
      allExpenses.push({ name: "⏰ REMINDER: BILL GOFO", amount: 0, account: "REMINDER", isRecurring: true, id: `rec-15th-gofo-reminder-${day}` });
      allExpenses.push({ name: "VINIX", amount: 503.05, account: "AUTO CE", isRecurring: true, id: `rec-15th-vinix-${day}` });
    }
    if (day === 17) allExpenses.push({ name: "LVVWD", amount: 375.00, account: "AUTO CE", isRecurring: true, id: `rec-17th-lvvwd-${day}` });
    if (day === 17) allExpenses.push({ name: "ADOBE", amount: 335.86, account: "AUTO SF", isRecurring: true, id: `rec-17th-adobe-${day}` });
    if (day === 19) {
      allExpenses.push({ name: "IPFS (CE INSURANCE)", amount: 3861.45, account: "AUTO CE", isRecurring: true, id: `rec-19th-ipfs-${day}` });
      allExpenses.push({ name: "ATLUS TOYOTA", amount: 3000.00, account: "AUTO SF", isRecurring: true, id: `rec-19th-atlus-${day}` });
    }
    if (day === 21) allExpenses.push({ name: "SAS", amount: 435.00, account: "AUTO J&A", isRecurring: true, id: `rec-21st-sas-${day}` });
    if (day === 25) allExpenses.push({ name: "DAT SOLUTIONS", amount: 2280.00, account: "AUTO SF", isRecurring: true, id: `rec-25th-dat-${day}` });
    if (day === 27) allExpenses.push({ name: "CLONEOPS", amount: 500.00, account: "AUTO CE", isRecurring: true, id: `rec-27th-cloneops-${day}` });
    if (day === 29) allExpenses.push({ name: "ZOOMINFO", amount: 833.33, account: "AUTO CE", isRecurring: true, id: `rec-29th-zoominfo-${day}` });

    if (day === 20) {
      allExpenses.push({ name: "GLG (5SEVEN5 INSURANCE)", amount: 1397.00, account: "AUTO SF", isRecurring: true, id: `rec-20th-glg-${day}` });
      if (currentMonth === 0 || currentMonth === 3 || currentMonth === 6 || currentMonth === 9) {
        allExpenses.push({ name: "REPUBLIC SERVICES", amount: 1667.10, account: "AUTO SF", isRecurring: true, id: `rec-20th-republic-${day}` });
      }
    }
    if (dayOfWeek === 1) allExpenses.push({ name: "OFFICE PAYROLL SUBMISSION", amount: 30000.00, account: "", isRecurring: true, id: `rec-mon-${day}` });
    if (dayOfWeek === 2) {
      allExpenses.push({ name: "WEX", amount: 4000.00, account: "", isRecurring: true, id: `rec-tue-wex-${day}` });
      allExpenses.push({ name: "RENT", amount: 5000.00, account: "", isRecurring: true, id: `rec-tue-rent-${day}` });
      allExpenses.push({ name: "ALEX NAHAI", amount: 500.00, account: "AUTO SF", isRecurring: true, id: `rec-tue-alex-${day}` });
    }
    if (dayOfWeek === 3) {
      allExpenses.push({ name: "UTILITY TRAILER", amount: 2520.00, account: "", isRecurring: true, id: `rec-wed-trailer-${day}` });
      allExpenses.push({ name: "MUDFLAP", amount: 2000.00, account: "", isRecurring: true, id: `rec-wed-mud-${day}` });
      allExpenses.push({ name: "COLOMBIA PAYROLL", amount: 2200.00, account: "AUTO CE", isRecurring: true, id: `rec-wed-colombia-${day}` });
      allExpenses.push({ name: "MCKINNEY TRAILERS", amount: 2500.00, account: "SF", isRecurring: true, id: `rec-wed-mckinney-${day}` });
      allExpenses.push({ name: "LENDR", amount: 2658.73, account: "AUTO SF", isRecurring: true, id: `rec-wed-lendr-${day}` });
    }
    if (dayOfWeek === 4) {
      allExpenses.push({ name: "DRIVER PAYROLL SUBMISSION", amount: 25000.00, account: "", isRecurring: true, id: `rec-thu-${day}` });
      const startDate = new Date(2026, 1, 12);
      const currentDate = new Date(currentYear, currentMonth, day);
      const daysDiff = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 0 && daysDiff % 14 === 0) {
        allExpenses.push({ name: "CHRIS MORTGAGE", amount: 8150.37, account: "", isRecurring: true, id: `rec-thu-mortgage-${day}` });
      }
    }
    if (dayOfWeek === 5) allExpenses.push({ name: "WEX", amount: 4000.00, account: "", isRecurring: true, id: `rec-fri-${day}` });

    // USER-ADDED custom recurring patterns
    customRecurring.forEach(pattern => {
      let matches = false;
      if (pattern.recurType === 'monthly-date') {
        matches = day === parseInt(pattern.recurDay);
      } else if (pattern.recurType === 'weekly-day') {
        matches = dayOfWeek === parseInt(pattern.recurDay);
      }
      if (matches) {
        allExpenses.push({
          name: pattern.name,
          amount: parseFloat(pattern.amount),
          account: pattern.account,
          isRecurring: true,
          id: `custom-${pattern.id}-${day}`
        });
      }
    });

    let filtered = allExpenses.filter(exp => {
      const itemKey = getItemKey(exp, `${currentYear}-${currentMonth}-${day}`);
      const isDeleted = deletedItems[itemKey];
      const matchesSearch = searchTerm === '' ||
        exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.account || '').toLowerCase().includes(searchTerm.toLowerCase());
      // If this is a one-time copy stamped with a specific month/year,
      // only show it in that month — prevents moved/edited recurring items
      // from bleeding into future months
      const isWrongMonth = exp.month !== undefined &&
        (exp.month !== currentMonth || exp.year !== currentYear);
      return !isDeleted && matchesSearch && !isWrongMonth;
    });

    // SORT
    if (daySort === 'amount-desc') {
      filtered = [...filtered].sort((a, b) => b.amount - a.amount);
    } else if (daySort === 'amount-asc') {
      filtered = [...filtered].sort((a, b) => a.amount - b.amount);
    } else if (daySort === 'unchecked-first') {
      filtered = [...filtered].sort((a, b) => {
        const aKey = getItemKey(a, `${currentYear}-${currentMonth}-${day}`);
        const bKey = getItemKey(b, `${currentYear}-${currentMonth}-${day}`);
        const aChecked = checkedItems[aKey] ? 1 : 0;
        const bChecked = checkedItems[bKey] ? 1 : 0;
        return aChecked - bChecked;
      });
    }

    return filtered;
  };

  const getDayTotal = (day) => getExpensesForDay(day).reduce((sum, exp) => sum + exp.amount, 0);

  const getDayPendingTotal = (day) => getExpensesForDay(day).reduce((sum, exp) => {
    const itemKey = getItemKey(exp, `${currentYear}-${currentMonth}-${day}`);
    return checkedItems[itemKey] ? sum : sum + exp.amount;
  }, 0);

  const getWeekTotal = (weekDays) => weekDays.reduce((sum, d) => sum + getDayPendingTotal(d.day), 0);

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
    setCheckedItems({}); setDeletedItems({});
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
    setCheckedItems({}); setDeletedItems({});
  };

  const weekdays = getWeekdays();
  const weeks = [];
  let currentWeek = [];
  weekdays.forEach((d, idx) => {
    currentWeek.push(d);
    if (d.dayOfWeek === 6 || idx === weekdays.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const getMonthlyTotal = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    let total = 0;
    for (let day = 1; day <= daysInMonth; day++) total += getDayTotal(day);
    return total;
  };

  const getCompletedTotal = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    let total = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      getExpensesForDay(day).forEach(exp => {
        const itemKey = getItemKey(exp, `${currentYear}-${currentMonth}-${day}`);
        if (checkedItems[itemKey]) total += exp.amount;
      });
    }
    return total;
  };

  const getPendingTotal = () => getMonthlyTotal() - getCompletedTotal();

  const getItemCounts = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    let total = 0, completed = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const exps = getExpensesForDay(day);
      total += exps.length;
      exps.forEach(exp => {
        const itemKey = getItemKey(exp, `${currentYear}-${currentMonth}-${day}`);
        if (checkedItems[itemKey]) completed++;
      });
    }
    return { total, completed };
  };

  const clearCompleted = () => {
    const newDeleted = { ...deletedItems };
    Object.keys(checkedItems).forEach(key => { if (checkedItems[key]) newDeleted[key] = true; });
    setDeletedItems(newDeleted);
    setCheckedItems({});
  };

  const resetMonth = () => {
    if (window.confirm('Reset all checks and deletions for this month?')) {
      setCheckedItems({});
      setDeletedItems({});
    }
  };

  const startEditAmount = (itemKey, currentAmount) => {
    setEditingAmount(itemKey);
    setEditValue(currentAmount.toString());
  };

  const saveEditAmount = (expense, day) => {
    const newAmount = parseFloat(editValue);
    if (isNaN(newAmount) || newAmount < 0) { setEditingAmount(null); return; }
    if (expense.isRecurring) {
      const newExpense = {
        name: expense.name, amount: newAmount, account: expense.account,
        day, isRecurring: false,
        month: currentMonth, year: currentYear,  // lock to this month only
        id: `edited-${Date.now()}-${Math.random()}`
      };
      setExpenses(prev => [...prev, newExpense]);
      deleteItem(getItemKey(expense, `${currentYear}-${currentMonth}-${day}`));
    } else {
      setExpenses(prev => prev.map(exp => exp.id === expense.id ? { ...exp, amount: newAmount } : exp));
    }
    setEditingAmount(null);
    setEditValue('');
  };

  const cancelEditAmount = () => { setEditingAmount(null); setEditValue(''); };

  // EDITABLE ACCOUNT
  const startEditAccount = (itemKey, currentAccount) => {
    setEditingAccount(itemKey);
    setEditAccountValue(currentAccount || '');
  };

  const saveEditAccount = (expense, day) => {
    if (expense.isRecurring) {
      const newExpense = {
        name: expense.name, amount: expense.amount, account: editAccountValue,
        day, isRecurring: false,
        month: currentMonth, year: currentYear,  // lock to this month only
        id: `edited-acct-${Date.now()}-${Math.random()}`
      };
      setExpenses(prev => [...prev, newExpense]);
      deleteItem(getItemKey(expense, `${currentYear}-${currentMonth}-${day}`));
    } else {
      setExpenses(prev => prev.map(exp => exp.id === expense.id ? { ...exp, account: editAccountValue } : exp));
    }
    setEditingAccount(null);
    setEditAccountValue('');
  };

  const cancelEditAccount = () => { setEditingAccount(null); setEditAccountValue(''); };

  // NOTES
  const toggleNoteOpen = (itemKey) => {
    setOpenNotes(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const updateNote = (itemKey, value) => {
    setNotes(prev => ({ ...prev, [itemKey]: value }));
  };

  const archiveCurrentMonth = () => {
    const monthKey = `${currentYear}-${currentMonth}`;
    const archiveData = {
      month: currentMonth, year: currentYear, monthName: monthNames[currentMonth],
      checkedItems: { ...checkedItems }, deletedItems: { ...deletedItems },
      expenses: [...expenses], archivedDate: new Date().toISOString(),
      totals: { monthly: getMonthlyTotal(), completed: getCompletedTotal(), pending: getPendingTotal() }
    };
    setArchivedMonths(prev => ({ ...prev, [monthKey]: archiveData }));
    alert(`${monthNames[currentMonth]} ${currentYear} has been archived!`);
  };

  const viewArchive = (monthKey) => {
    const archive = archivedMonths[monthKey];
    if (archive) {
      setViewingArchive(monthKey);
      setCurrentMonth(archive.month);
      setCurrentYear(archive.year);
      setCheckedItems(archive.checkedItems);
      setDeletedItems(archive.deletedItems);
      setExpenses(archive.expenses);
      setShowArchiveList(false);
    }
  };

  const exitArchiveView = () => {
    setViewingArchive(null);
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
    setCheckedItems({});
    setDeletedItems({});
    setExpenses(initialExpenses);
  };

  const getArchivedMonthsList = () =>
    Object.keys(archivedMonths).sort().reverse().map(key => ({ key, ...archivedMonths[key] }));

  const addNewExpense = () => {
    const { name, amount, account, isRecurring, recurType, recurDay, oneTimeDay } = newExpenseForm;

    if (!name.trim() || !amount || !account.trim()) {
      alert('Please fill in Name, Amount, and Account'); return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
      alert('Please enter a valid amount'); return;
    }

    if (isRecurring) {
      if (!recurDay && recurDay !== 0) {
        alert(recurType === 'monthly-date' ? 'Please enter the day of month' : 'Please select a day of week'); return;
      }
      if (recurType === 'monthly-date') {
        const d = parseInt(recurDay);
        if (isNaN(d) || d < 1 || d > 31) { alert('Day of month must be between 1 and 31'); return; }
      }
      // Save as a custom recurring pattern — shows up every matching day going forward
      const pattern = {
        id: `cr-${Date.now()}`,
        name: name.trim(),
        amount: parseFloat(amount),
        account: account.trim(),
        recurType,
        recurDay: recurType === 'weekly-day' ? parseInt(recurDay) : parseInt(recurDay),
      };
      setCustomRecurring(prev => [...prev, pattern]);
    } else {
      const d = parseInt(oneTimeDay);
      if (!oneTimeDay || isNaN(d) || d < 1 || d > 31) {
        alert('Please enter a valid day of month (1–31)'); return;
      }
      // Stamp with current month/year so it only shows this month
      const newExp = {
        name: name.trim(),
        amount: parseFloat(amount),
        account: account.trim(),
        day: d,
        month: currentMonth,
        year: currentYear,
        id: `exp-new-${Date.now()}`
      };
      setExpenses(prev => [...prev, newExp]);
    }

    setNewExpenseForm({
      name: '', amount: '', account: '', isRecurring: false,
      recurType: 'monthly-date', recurDay: '',
      oneTimeDay: '', oneTimeMonth: currentMonth, oneTimeYear: currentYear
    });
    setShowAddExpenseModal(false);
  };

  const deleteCustomRecurring = (id) => {
    setCustomRecurring(prev => prev.filter(p => p.id !== id));
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('Please allow popups to export PDF'); return; }
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    let html = `<!DOCTYPE html><html><head><title>${monthNames[currentMonth]} ${currentYear} Expense Report</title>
    <style>body{font-family:Arial,sans-serif;padding:20px}h1{text-align:center;color:#333}
    .summary{background:#f0f0f0;padding:15px;margin:20px 0;border-radius:8px}
    .summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}
    .summary-box{text-align:center}.summary-label{font-size:12px;color:#666}
    .summary-value{font-size:20px;font-weight:bold;color:#333}
    .week{margin-bottom:30px;page-break-inside:avoid}
    .week-header{background:#4CAF50;color:white;padding:10px;font-weight:bold;margin-bottom:10px}
    .days-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}
    .day{border:1px solid #ddd;padding:10px;min-height:150px}
    .day-header{font-weight:bold;border-bottom:2px solid #333;padding-bottom:5px;margin-bottom:10px}
    .expense{margin:5px 0;padding:5px;background:#f9f9f9;border-left:3px solid #2196F3}
    .expense.completed{background:#e8f5e9;border-left-color:#4CAF50;text-decoration:line-through}
    .expense.recurring{border-left-color:#9C27B0}
    .expense-name{font-weight:bold;font-size:11px}.expense-amount{color:#4CAF50;font-weight:bold;font-size:11px}
    .expense-account{color:#666;font-size:10px}.expense-notes{color:#999;font-size:9px;font-style:italic}
    .day-total{margin-top:10px;padding-top:5px;border-top:2px solid #333;font-weight:bold;color:#2196F3;font-size:12px}
    .weekend{background:#f5f5f5}.holiday{background:#fff9c4}
    @media print{.week{page-break-inside:avoid}}</style></head><body>
    <h1>${monthNames[currentMonth]} ${currentYear} Expense Report</h1>
    <div class="summary"><div class="summary-grid">
    <div class="summary-box"><div class="summary-label">Monthly Total</div><div class="summary-value">$${getMonthlyTotal().toLocaleString('en-US',{minimumFractionDigits:2})}</div></div>
    <div class="summary-box"><div class="summary-label">Completed</div><div class="summary-value">$${getCompletedTotal().toLocaleString('en-US',{minimumFractionDigits:2})}</div></div>
    <div class="summary-box"><div class="summary-label">Pending</div><div class="summary-value">$${getPendingTotal().toLocaleString('en-US',{minimumFractionDigits:2})}</div></div>
    </div></div>`;
    weeks.forEach((week, weekIdx) => {
      html += `<div class="week"><div class="week-header">Week ${weekIdx + 1} - Total: $${getWeekTotal(week).toLocaleString('en-US',{minimumFractionDigits:2})}</div><div class="days-grid">`;
      dayNames.forEach((dayName, dayIdx) => {
        const dayData = week.find(d => d.dayOfWeek === dayIdx);
        const day = dayData?.day;
        const holiday = day ? isBankHoliday(day, currentMonth, currentYear) : null;
        const isWeekend = dayIdx === 0 || dayIdx === 6;
        html += `<div class="day ${isWeekend?'weekend':''} ${holiday?'holiday':''}">`;
        html += `<div class="day-header">${dayName}${day?` ${day}`:''}${holiday?`<br><span style="color:#F57C00;font-size:10px">${holiday.name}</span>`:''}</div>`;
        if (day) {
          getExpensesForDay(day).forEach(exp => {
            const itemKey = getItemKey(exp, `${currentYear}-${currentMonth}-${day}`);
            const isChecked = checkedItems[itemKey];
            const note = notes[itemKey];
            html += `<div class="expense ${isChecked?'completed':''} ${exp.isRecurring?'recurring':''}">`;
            html += `<div class="expense-name">${exp.name}</div>`;
            html += `<div class="expense-amount">$${exp.amount.toLocaleString('en-US',{minimumFractionDigits:2})}</div>`;
            if (exp.account) html += `<div class="expense-account">${exp.account}</div>`;
            if (note) html += `<div class="expense-notes">📝 ${note}</div>`;
            html += `</div>`;
          });
          html += `<div class="day-total">Total: $${getDayTotal(day).toLocaleString('en-US',{minimumFractionDigits:2})}</div>`;
        }
        html += `</div>`;
      });
      html += `</div></div>`;
    });
    html += `</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const sortOptions = [
    { value: 'default', label: 'Default Order' },
    { value: 'amount-desc', label: 'Amount: High → Low' },
    { value: 'amount-asc', label: 'Amount: Low → High' },
    { value: 'unchecked-first', label: 'Unpaid First' },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-3">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg p-3">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Expense Calendar</h1>
            <div className="flex items-center gap-2 text-xs">
              {saveStatus === 'saving' && <span className="text-orange-600">💾 Saving...</span>}
              {saveStatus === 'saved' && <span className="text-green-600">✓ Saved</span>}
              {saveStatus === 'error' && <span className="text-red-600">⚠️ Save Error</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {!viewingArchive && (
              <>
                <button onClick={() => setShowAddExpenseModal(true)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Quick Add
                </button>
                <button onClick={archiveCurrentMonth} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5">
                  <Archive className="w-4 h-4" /> Archive
                </button>
                <button onClick={() => setShowArchiveList(!showArchiveList)} className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4" /> Archives ({Object.keys(archivedMonths).length})
                </button>
              </>
            )}
            {viewingArchive && (
              <button onClick={exitArchiveView} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Exit Archive
              </button>
            )}
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <div className="text-lg font-bold text-gray-800 min-w-[180px] text-center">{monthNames[currentMonth]} {currentYear}</div>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {/* ARCHIVE BANNER */}
        {viewingArchive && (
          <div className="mb-3 p-3 bg-purple-100 border-2 border-purple-400 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-purple-700" />
                <div>
                  <div className="font-bold text-purple-900">Viewing Archived Month</div>
                  <div className="text-sm text-purple-700">Archived on {new Date(archivedMonths[viewingArchive].archivedDate).toLocaleString()}</div>
                </div>
              </div>
              <button onClick={exitArchiveView} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium">Return to Current Month</button>
            </div>
          </div>
        )}

        {/* ARCHIVE LIST */}
        {showArchiveList && !viewingArchive && (
          <div className="mb-3 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">Archived Months</h3>
              <button onClick={() => setShowArchiveList(false)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            {getArchivedMonthsList().length === 0 ? (
              <div className="text-gray-500 text-center py-4">No archived months yet</div>
            ) : (
              <div className="space-y-2">
                {getArchivedMonthsList().map(archive => (
                  <div key={archive.key} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{archive.monthName} {archive.year}</div>
                      <div className="text-sm text-gray-600">
                        Total: ${archive.totals.monthly.toLocaleString('en-US',{minimumFractionDigits:2})} | Paid: ${archive.totals.completed.toLocaleString('en-US',{minimumFractionDigits:2})} | Pending: ${archive.totals.pending.toLocaleString('en-US',{minimumFractionDigits:2})}
                      </div>
                      <div className="text-xs text-gray-500">Archived: {new Date(archive.archivedDate).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => viewArchive(archive.key)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEARCH + SORT + EXPORT */}
        <div className="mb-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses by name or account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {/* SORT SELECTOR */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={daySort}
              onChange={(e) => setDaySort(e.target.value)}
              className="py-1.5 px-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button onClick={generatePDF} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>

        {/* SUMMARY */}
        <div className="mb-3 grid grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-xs text-gray-600 mb-1">Monthly Total</div>
            <div className="text-lg font-bold text-gray-800">${getMonthlyTotal().toLocaleString('en-US',{minimumFractionDigits:2})}</div>
            <div className="text-xs text-gray-500 mt-1">{getItemCounts().total} items</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <div className="text-xs text-gray-600 mb-1">Completed</div>
            <div className="text-lg font-bold text-green-700">${getCompletedTotal().toLocaleString('en-US',{minimumFractionDigits:2})}</div>
            <div className="text-xs text-gray-500 mt-1">{getItemCounts().completed} of {getItemCounts().total} items</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <div className="text-xs text-gray-600 mb-1">Pending</div>
            <div className="text-lg font-bold text-orange-700">${getPendingTotal().toLocaleString('en-US',{minimumFractionDigits:2})}</div>
            <div className="text-xs text-gray-500 mt-1">{getItemCounts().total - getItemCounts().completed} items left</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex flex-col gap-2">
            {!viewingArchive ? (
              <>
                <button onClick={clearCompleted} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium">Clear Completed</button>
                <button onClick={resetMonth} className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium">Reset Month</button>
              </>
            ) : (
              <div className="text-xs text-center text-gray-500 py-2">Read-only<br/>Archive View</div>
            )}
          </div>
        </div>

        {/* TIPS */}
        <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-xs text-gray-700 flex flex-wrap gap-x-3 gap-y-1">
            <strong>💡 Tips:</strong>
            <span>✓ Check = paid</span>
            <span>🗑️ Skip</span>
            <span>⋮⋮ Drag to move</span>
            <span>💰 Click $ to edit</span>
            <span>🏷️ Click account to edit</span>
            <span>📝 Notes per item</span>
            <span>✓✓ Bulk check all in a day</span>
            <span className="text-amber-700 font-semibold">🟡 Amber = due in 3 days</span>
            <span className="text-red-700 font-semibold">🔴 Red outline = overdue unpaid</span>
            <span>(R) = Recurring</span>
            <span>💾 Auto-saves</span>
          </div>
        </div>

        {/* ADD EXPENSE MODAL */}
        {showAddExpenseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>
                <button onClick={() => setShowAddExpenseModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" value={newExpenseForm.name}
                    onChange={(e) => setNewExpenseForm({...newExpenseForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Office Supplies" autoFocus />
                </div>
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" min="0" value={newExpenseForm.amount}
                    onChange={(e) => setNewExpenseForm({...newExpenseForm, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="0.00" />
                </div>
                {/* Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account <span className="text-red-500">*</span></label>
                  <input type="text" value={newExpenseForm.account}
                    onChange={(e) => setNewExpenseForm({...newExpenseForm, account: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., AUTO SF" />
                </div>
                {/* Recurring toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="recurring" checked={newExpenseForm.isRecurring}
                    onChange={(e) => setNewExpenseForm({...newExpenseForm, isRecurring: e.target.checked, recurDay: ''})}
                    className="w-4 h-4 accent-blue-600" />
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-700 cursor-pointer">
                    This is a recurring expense
                  </label>
                </div>

                {/* Recurring fields */}
                {newExpenseForm.isRecurring ? (
                  <div className="space-y-3 pl-3 border-l-4 border-blue-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Repeats</label>
                      <select value={newExpenseForm.recurType}
                        onChange={(e) => setNewExpenseForm({...newExpenseForm, recurType: e.target.value, recurDay: ''})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                        <option value="monthly-date">Monthly — on a specific date</option>
                        <option value="weekly-day">Weekly — on a specific day</option>
                      </select>
                    </div>
                    {newExpenseForm.recurType === 'monthly-date' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Day of month <span className="text-red-500">*</span></label>
                        <input type="number" min="1" max="31" value={newExpenseForm.recurDay}
                          onChange={(e) => setNewExpenseForm({...newExpenseForm, recurDay: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="e.g., 15" />
                        <p className="text-xs text-gray-500 mt-1">Will appear on this date every month</p>
                      </div>
                    )}
                    {newExpenseForm.recurType === 'weekly-day' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Day of week <span className="text-red-500">*</span></label>
                        <select value={newExpenseForm.recurDay}
                          onChange={(e) => setNewExpenseForm({...newExpenseForm, recurDay: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                          <option value="">Select a day...</option>
                          <option value="0">Sunday</option>
                          <option value="1">Monday</option>
                          <option value="2">Tuesday</option>
                          <option value="3">Wednesday</option>
                          <option value="4">Thursday</option>
                          <option value="5">Friday</option>
                          <option value="6">Saturday</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Will appear on this day every week</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* One-time fields */
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day of month <span className="text-red-500">*</span></label>
                    <input type="number" min="1" max="31" value={newExpenseForm.oneTimeDay}
                      onChange={(e) => setNewExpenseForm({...newExpenseForm, oneTimeDay: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder={`1–${new Date(currentYear, currentMonth+1, 0).getDate()} for ${monthNames[currentMonth]}`} />
                    <p className="text-xs text-gray-500 mt-1">Only appears in {monthNames[currentMonth]} {currentYear}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button onClick={addNewExpense}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                    {newExpenseForm.isRecurring ? '+ Add Recurring' : '+ Add Expense'}
                  </button>
                  <button onClick={() => setShowAddExpenseModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium">
                    Cancel
                  </button>
                </div>

                {/* Manage existing custom recurring */}
                {customRecurring.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Your recurring expenses</div>
                    <div className="space-y-1.5">
                      {customRecurring.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-800 truncate">{p.name}</div>
                            <div className="text-xs text-gray-500">
                              ${parseFloat(p.amount).toLocaleString('en-US', {minimumFractionDigits:2})} · {p.account} ·{' '}
                              {p.recurType === 'monthly-date'
                                ? `Every month on the ${p.recurDay}${['st','nd','rd'][((p.recurDay % 10)-1)] || 'th'}`
                                : `Every ${dayNames[p.recurDay]}`}
                            </div>
                          </div>
                          <button onClick={() => deleteCustomRecurring(p.id)}
                            className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
                            title="Remove this recurring expense">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR WEEKS */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="mb-4">
            {/* STICKY WEEK TOTAL */}
            <div className="sticky top-0 z-20 mb-2 px-3 py-2 bg-green-600 text-white rounded-lg shadow-md flex items-center justify-between">
              <span className="text-sm font-bold tracking-wide">Week {weekIdx + 1}</span>
              <span className="text-sm font-bold">
                Pending: ${getWeekTotal(week).toLocaleString('en-US',{minimumFractionDigits:2})}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((dayName, dayIdx) => {
                const dayData = week.find(d => d.dayOfWeek === dayIdx);
                const day = dayData?.day;
                const holiday = day ? isBankHoliday(day, currentMonth, currentYear) : null;
                const isWeekend = dayIdx === 0 || dayIdx === 6;
                const dueSoon = day ? isDueSoon(day) : false;
                const overdue = day ? isOverdue(day) : false;
                const dayExpenses = day ? getExpensesForDay(day) : [];
                const allChecked = day && dayExpenses.length > 0 && dayExpenses.every(exp => checkedItems[getItemKey(exp, `${currentYear}-${currentMonth}-${day}`)]);
                const hasUnchecked = day && dayExpenses.some(exp => !checkedItems[getItemKey(exp, `${currentYear}-${currentMonth}-${day}`)]);

                return (
                  <div
                    key={dayIdx}
                    className={`border-2 rounded-lg p-2 transition-all ${
                      holiday ? 'bg-yellow-50 border-yellow-400' :
                      dueSoon ? 'bg-amber-50 border-amber-400' :
                      overdue && hasUnchecked ? 'bg-red-50 border-red-300' :
                      isWeekend ? 'bg-gray-100 border-gray-300' :
                      'border-gray-300'
                    } ${dragOverDay === day ? 'ring-4 ring-blue-400 bg-blue-50' : ''}`}
                    onDragOver={(e) => day && handleDragOver(e, day)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => day && handleDrop(e, day)}
                  >
                    {/* DAY HEADER */}
                    <div className="font-bold text-sm mb-1.5 pb-1.5 border-b-2 border-gray-300 flex items-center justify-between gap-1">
                      <div>
                        <span>{dayName}</span>
                        {day && <span className="ml-1.5 text-gray-600">{day}</span>}
                        {dueSoon && <span className="ml-1 text-xs text-amber-700 font-semibold">⚡ Due soon</span>}
                        {overdue && hasUnchecked && <span className="ml-1 text-xs text-red-600 font-semibold">⚠️ Overdue</span>}
                        {holiday && <div className="text-xs text-yellow-700 font-semibold">{holiday.name}</div>}
                      </div>
                      {/* BULK CHECK BUTTON */}
                      {day && dayExpenses.length > 1 && !viewingArchive && (
                        <button
                          onClick={() => bulkCheckDay(day)}
                          title={allChecked ? "Uncheck all" : "Check all as paid"}
                          className={`flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold border transition-colors ${
                            allChecked
                              ? 'bg-green-500 border-green-600 text-white hover:bg-green-600'
                              : 'bg-white border-gray-400 text-gray-600 hover:bg-green-50 hover:border-green-500 hover:text-green-700'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5" />
                          <span>All</span>
                        </button>
                      )}
                    </div>

                    {day ? (
                      <div className="space-y-1.5">
                        {dayExpenses.map((expense, idx) => {
                          const itemKey = getItemKey(expense, `${currentYear}-${currentMonth}-${day}`);
                          const isChecked = checkedItems[itemKey];
                          const note = notes[itemKey] || '';
                          const noteOpen = openNotes[itemKey];

                          return (
                            <div
                              key={idx}
                              className={`p-1.5 rounded border ${viewingArchive ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} ${
                                expense.amount === 0 ? 'bg-orange-50 border-orange-300' :
                                isChecked ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                              }`}
                              draggable={!viewingArchive}
                              onDragStart={(e) => !viewingArchive && handleDragStart(e, expense, day)}
                            >
                              <div className="flex items-start gap-1.5">
                                {!viewingArchive && <GripVertical className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0 cursor-grab" />}
                                <button
                                  onClick={() => !viewingArchive && toggleCheck(itemKey)}
                                  disabled={viewingArchive}
                                  className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-400'} ${viewingArchive ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                  {isChecked && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                  {/* NAME */}
                                  <div className={`text-xs font-semibold ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {expense.name}
                                    {expense.isRecurring && <span className="ml-1 text-xs text-purple-600">(R)</span>}
                                  </div>

                                  {/* AMOUNT */}
                                  {editingAmount === itemKey && !viewingArchive ? (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-xs text-green-700">$</span>
                                      <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={(e) => { if (e.key==='Enter') saveEditAmount(expense,day); if (e.key==='Escape') cancelEditAmount(); }}
                                        className="w-20 px-1 py-0.5 text-xs border-2 border-blue-500 rounded focus:outline-none" autoFocus />
                                      <button onClick={() => saveEditAmount(expense,day)} className="p-0.5 bg-green-500 hover:bg-green-600 text-white rounded"><Check className="w-2.5 h-2.5" /></button>
                                      <button onClick={cancelEditAmount} className="p-0.5 bg-gray-400 hover:bg-gray-500 text-white rounded"><X className="w-2.5 h-2.5" /></button>
                                    </div>
                                  ) : expense.amount === 0 ? (
                                    <div className="text-xs text-orange-600 font-bold italic">REMINDER</div>
                                  ) : (
                                    <div
                                      className={`text-xs ${isChecked ? 'line-through text-gray-400' : 'text-green-700'} font-bold ${viewingArchive ? '' : 'cursor-pointer hover:bg-green-100'} inline-block px-1 rounded`}
                                      onClick={() => !viewingArchive && startEditAmount(itemKey, expense.amount)}
                                      title={viewingArchive ? '' : "Click to edit amount"}
                                    >
                                      ${expense.amount.toLocaleString('en-US',{minimumFractionDigits:2})}
                                    </div>
                                  )}

                                  {/* ACCOUNT — EDITABLE */}
                                  {editingAccount === itemKey && !viewingArchive ? (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <input type="text" value={editAccountValue} onChange={(e) => setEditAccountValue(e.target.value)}
                                        onKeyDown={(e) => { if (e.key==='Enter') saveEditAccount(expense,day); if (e.key==='Escape') cancelEditAccount(); }}
                                        className="w-full px-1 py-0.5 text-xs border-2 border-blue-500 rounded focus:outline-none" autoFocus placeholder="Account..." />
                                      <button onClick={() => saveEditAccount(expense,day)} className="p-0.5 bg-green-500 hover:bg-green-600 text-white rounded flex-shrink-0"><Check className="w-2.5 h-2.5" /></button>
                                      <button onClick={cancelEditAccount} className="p-0.5 bg-gray-400 hover:bg-gray-500 text-white rounded flex-shrink-0"><X className="w-2.5 h-2.5" /></button>
                                    </div>
                                  ) : expense.account ? (
                                    <div
                                      className={`text-xs ${isChecked ? 'text-gray-400' : 'text-gray-500'} truncate ${viewingArchive ? '' : 'cursor-pointer hover:bg-blue-50 hover:text-blue-700 rounded px-0.5'}`}
                                      onClick={() => !viewingArchive && startEditAccount(itemKey, expense.account)}
                                      title={viewingArchive ? expense.account : "Click to edit account"}
                                    >
                                      🏷️ {expense.account}
                                    </div>
                                  ) : !viewingArchive ? (
                                    <div
                                      className="text-xs text-gray-400 cursor-pointer hover:text-blue-600 rounded px-0.5"
                                      onClick={() => startEditAccount(itemKey, '')}
                                    >
                                      + account
                                    </div>
                                  ) : null}

                                  {/* NOTE TOGGLE + INPUT */}
                                  {!viewingArchive && (
                                    <div className="mt-0.5">
                                      <button
                                        onClick={() => toggleNoteOpen(itemKey)}
                                        className={`text-xs flex items-center gap-0.5 ${note ? 'text-blue-600 font-semibold' : 'text-gray-400 hover:text-blue-500'}`}
                                        title={note ? "View/edit note" : "Add note"}
                                      >
                                        📝 {note ? 'Note' : 'Add note'}
                                      </button>
                                      {noteOpen && (
                                        <textarea
                                          value={note}
                                          onChange={(e) => updateNote(itemKey, e.target.value)}
                                          placeholder="e.g., Check #1042, confirmed..."
                                          rows={2}
                                          className="mt-0.5 w-full text-xs px-1.5 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                                          autoFocus
                                        />
                                      )}
                                    </div>
                                  )}
                                  {viewingArchive && note && (
                                    <div className="text-xs text-blue-600 italic mt-0.5">📝 {note}</div>
                                  )}
                                </div>
                                {!viewingArchive && (
                                  <button onClick={() => deleteItem(itemKey)} className="p-0.5 text-red-500 hover:bg-red-50 rounded flex-shrink-0">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div className="mt-2 pt-2 border-t-2 border-gray-300">
                          <div className="text-xs font-bold text-blue-700">Total: ${getDayTotal(day).toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center py-4">-</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseCalendar;
