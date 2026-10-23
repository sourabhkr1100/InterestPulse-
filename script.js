/**
 * InterestPulse - Simple Interest Calculator
 * Modern, Interactive, Financial Suite
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const state = {
        principal: 50000,
        rate: 7.5,
        time: 5,
        timeUnit: 'years', // 'years' | 'months'
        currencySymbol: '$',
        currencyCode: 'USD',
        isTableExpanded: false
    };

    // Cache of active animations for smooth number transitions
    const counterAnimations = new Map();

    // --- DOM Elements ---
    const dom = {
        // Form & Inputs
        calculatorForm: document.getElementById('calculator-form'),
        principalInput: document.getElementById('principal-input'),
        principalSlider: document.getElementById('principal-slider'),
        principalCurrency: document.getElementById('principal-currency'),
        rateInput: document.getElementById('rate-input'),
        rateSlider: document.getElementById('rate-slider'),
        timeInput: document.getElementById('time-input'),
        timeSlider: document.getElementById('time-slider'),
        timeUnitDisplay: document.getElementById('time-unit-display'),
        unitYearsBtn: document.getElementById('unit-years-btn'),
        unitMonthsBtn: document.getElementById('unit-months-btn'),
        currencySelect: document.getElementById('currency-select'),
        resetBtn: document.getElementById('reset-btn'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),

        // Hero Results
        heroCurrency: document.getElementById('hero-currency'),
        totalAmountDisplay: document.getElementById('total-amount-display'),
        growthPercentage: document.getElementById('growth-percentage'),
        growthBadge: document.getElementById('growth-badge'),
        previewP: document.getElementById('preview-p'),
        previewI: document.getElementById('preview-i'),

        // Metric Cards
        principalResCurr: document.getElementById('principal-res-curr'),
        principalResultVal: document.getElementById('principal-result-val'),
        principalPctVal: document.getElementById('principal-pct-val'),

        interestResCurr: document.getElementById('interest-res-curr'),
        interestResultVal: document.getElementById('interest-result-val'),
        interestPctVal: document.getElementById('interest-pct-val'),

        annualResCurr: document.getElementById('annual-res-curr'),
        annualReturnVal: document.getElementById('annual-return-val'),
        monthlyReturnSub: document.getElementById('monthly-return-sub'),

        // Chart & Ratios
        donutPrincipalCircle: document.getElementById('donut-principal-circle'),
        donutInterestCircle: document.getElementById('donut-interest-circle'),
        donutCenterPct: document.getElementById('donut-center-pct'),
        barPrincipal: document.getElementById('bar-principal'),
        barInterest: document.getElementById('bar-interest'),
        ratioDisplay: document.getElementById('ratio-display'),
        effectiveYieldDisplay: document.getElementById('effective-yield-display'),
        doublingTimeDisplay: document.getElementById('doubling-time-display'),

        // Formula breakdown
        dynamicFormulaCalc: document.getElementById('dynamic-formula-calc'),
        dynamicAmountCalc: document.getElementById('dynamic-amount-calc'),

        // Comparison & Schedule Tables
        comparisonTableBody: document.getElementById('comparison-table-body'),
        scheduleTableBody: document.getElementById('schedule-table-body'),
        scheduleTableContainer: document.getElementById('schedule-table-container'),
        toggleTableBtn: document.getElementById('toggle-table-btn'),
        toggleTableText: document.getElementById('toggle-table-text'),

        // Actions
        copySummaryBtn: document.getElementById('copy-summary-btn'),
        exportCsvBtn: document.getElementById('export-csv-btn'),
        printScheduleBtn: document.getElementById('print-schedule-btn'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toast-message')
    };

    // --- Formatters ---
    const formatNumber = (num, decimals = 0) => {
        return Number(num).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    const formatCurrency = (num, decimals = 0) => {
        return `${state.currencySymbol}${formatNumber(num, decimals)}`;
    };

    // --- Toast Notification Helper ---
    let toastTimeout = null;
    const showToast = (message) => {
        if (!dom.toast || !dom.toastMessage) return;
        dom.toastMessage.textContent = message;
        dom.toast.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            dom.toast.classList.remove('show');
        }, 3200);
    };

    // --- Animate Number Transitions ---
    const animateValue = (element, start, end, duration = 400, decimals = 0) => {
        if (!element) return;
        if (counterAnimations.has(element)) {
            cancelAnimationFrame(counterAnimations.get(element));
        }

        const startTime = performance.now();
        const diff = end - start;

        // If difference is negligible, instantly update
        if (Math.abs(diff) < 0.001) {
            element.textContent = formatNumber(end, decimals);
            return;
        }

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + diff * ease;

            element.textContent = formatNumber(currentVal, decimals);

            if (progress < 1) {
                const animId = requestAnimationFrame(step);
                counterAnimations.set(element, animId);
            } else {
                element.textContent = formatNumber(end, decimals);
                counterAnimations.delete(element);
            }
        };

        const animId = requestAnimationFrame(step);
        counterAnimations.set(element, animId);
    };

    // Previous values cache for animations
    const prevValues = {
        totalAmount: 68750,
        principal: 50000,
        interest: 18750,
        annualReturn: 3750
    };

    // --- Core Calculation Logic ---
    const calculateSimpleInterest = () => {
        const P = Math.max(0, state.principal);
        const R = Math.max(0, state.rate);
        const rawTime = Math.max(0, state.time);
        
        // Time in years for the formula I = (P * R * T) / 100
        const T_years = state.timeUnit === 'months' ? rawTime / 12 : rawTime;

        // Formula: Simple Interest = (P * R * T) / 100
        const interest = (P * R * T_years) / 100;
        const totalAmount = P + interest;
        const annualReturn = T_years > 0 ? interest / T_years : (P * R) / 100;
        const monthlyReturn = annualReturn / 12;

        const growthPct = P > 0 ? (interest / P) * 100 : 0;
        const principalPct = totalAmount > 0 ? (P / totalAmount) * 100 : 0;
        const interestPct = totalAmount > 0 ? (interest / totalAmount) * 100 : 0;

        return {
            P,
            R,
            rawTime,
            T_years,
            interest,
            totalAmount,
            annualReturn,
            monthlyReturn,
            growthPct,
            principalPct,
            interestPct
        };
    };

    // --- Update UI with Results ---
    const updateUI = () => {
        const results = calculateSimpleInterest();
        const { P, R, rawTime, T_years, interest, totalAmount, annualReturn, monthlyReturn, growthPct, principalPct, interestPct } = results;

        // 1. Currency Symbols
        const curr = state.currencySymbol;
        dom.principalCurrency.textContent = curr;
        dom.heroCurrency.textContent = curr;
        dom.principalResCurr.textContent = curr;
        dom.interestResCurr.textContent = curr;
        dom.annualResCurr.textContent = curr;

        // 2. Hero Card & Badges with animated counter
        animateValue(dom.totalAmountDisplay, prevValues.totalAmount, totalAmount, 350, 0);
        dom.growthPercentage.textContent = `+${growthPct.toFixed(1)}%`;
        dom.previewP.textContent = formatCurrency(P);
        dom.previewI.textContent = formatCurrency(interest);

        // 3. Metric Cards with animations
        animateValue(dom.principalResultVal, prevValues.principal, P, 350, 0);
        dom.principalPctVal.textContent = `${principalPct.toFixed(1)}% of total`;

        animateValue(dom.interestResultVal, prevValues.interest, interest, 350, 0);
        dom.interestPctVal.textContent = `${interestPct.toFixed(1)}% of total`;

        animateValue(dom.annualReturnVal, prevValues.annualReturn, annualReturn, 350, 0);
        dom.monthlyReturnSub.textContent = `~${formatCurrency(monthlyReturn, 2)} / month`;

        // Cache previous values
        prevValues.totalAmount = totalAmount;
        prevValues.principal = P;
        prevValues.interest = interest;
        prevValues.annualReturn = annualReturn;

        // 4. Update SVG Donut Chart
        updateDonutChart(principalPct, interestPct);

        // 5. Update Progress Bar & Side Stats
        dom.barPrincipal.style.width = `${principalPct}%`;
        dom.barInterest.style.width = `${interestPct}%`;

        const ratio = P > 0 ? (interest / P).toFixed(2) : '0';
        dom.ratioDisplay.textContent = `1 : ${ratio}`;
        dom.effectiveYieldDisplay.textContent = `${R.toFixed(2)}%`;

        const doublingYears = R > 0 ? (72 / R).toFixed(1) : '∞';
        dom.doublingTimeDisplay.textContent = doublingYears !== '∞' ? `~${doublingYears} Years` : 'N/A';

        // 6. Update Formula Step-by-Step Visualization
        updateFormulaVisuals(P, R, rawTime, T_years, interest, totalAmount);

        // 7. Update Comparison Matrix Table
        updateComparisonTable(P, R, T_years);

        // 8. Update Year-by-Year Growth Table
        updateScheduleTable(P, R, rawTime, state.timeUnit);

        // Update Slider backgrounds for filled visual effect
        updateSliderFill(dom.principalSlider, 1000, 1000000, P);
        updateSliderFill(dom.rateSlider, 0.5, 25, R);
        const timeMax = state.timeUnit === 'years' ? 30 : 360;
        const timeMin = state.timeUnit === 'years' ? 1 : 1;
        updateSliderFill(dom.timeSlider, timeMin, timeMax, rawTime);
    };

    // --- Slider Fill Gradient Helper ---
    const updateSliderFill = (slider, min, max, value) => {
        if (!slider) return;
        const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
        slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--bg-chip) ${pct}%, var(--bg-chip) 100%)`;
    };

    // --- SVG Donut Chart ---
    const updateDonutChart = (principalPct, interestPct) => {
        // Circumference for r=70 is 2 * PI * 70 = 439.82297
        const radius = 70;
        const circumference = 2 * Math.PI * radius;

        const principalStroke = (principalPct / 100) * circumference;
        const interestStroke = (interestPct / 100) * circumference;

        // Principal segment starts at top (0 offset)
        dom.donutPrincipalCircle.style.strokeDasharray = `${principalStroke} ${circumference}`;
        dom.donutPrincipalCircle.style.strokeDashoffset = '0';

        // Interest segment starts right after principal
        dom.donutInterestCircle.style.strokeDasharray = `${interestStroke} ${circumference}`;
        dom.donutInterestCircle.style.strokeDashoffset = `${-principalStroke}`;

        dom.donutCenterPct.textContent = `${interestPct.toFixed(1)}%`;
    };

    // --- Dynamic Formula Visualization ---
    const updateFormulaVisuals = (P, R, rawTime, T_years, interest, totalAmount) => {
        const timeStr = state.timeUnit === 'months' 
            ? `(${rawTime} / 12)` 
            : `${rawTime}`;

        dom.dynamicFormulaCalc.innerHTML = `
            <span class="math-var">I</span> = 
            <span class="fraction">
                <span class="numerator"><span class="val-p">${formatCurrency(P)}</span> &times; <span class="val-r">${R}%</span> &times; <span class="val-t">${timeStr}</span></span>
                <span class="denominator">100</span>
            </span>
            = <strong class="math-result" id="formula-interest-result">${formatCurrency(interest)}</strong>
        `;

        dom.dynamicAmountCalc.innerHTML = `
            <span class="math-var">A</span> = <span class="val-p">${formatCurrency(P)}</span> + <span class="val-i">${formatCurrency(interest)}</span> = <strong class="math-result text-accent" id="formula-total-result">${formatCurrency(totalAmount)}</strong>
        `;
    };

    // --- Rate Sensitivity Comparison Table ---
    const updateComparisonTable = (P, baseRate, T_years) => {
        const scenarios = [
            { label: '-2.0% Lower', rateOffset: -2.0 },
            { label: '-1.0% Lower', rateOffset: -1.0 },
            { label: 'Current Rate', rateOffset: 0.0, isCurrent: true },
            { label: '+1.0% Higher', rateOffset: 1.0 },
            { label: '+2.0% Higher', rateOffset: 2.0 }
        ];

        let html = '';
        const baseInterest = (P * baseRate * T_years) / 100;

        scenarios.forEach(sc => {
            const effectiveRate = Math.max(0.1, baseRate + sc.rateOffset);
            const scInterest = (P * effectiveRate * T_years) / 100;
            const scTotal = P + scInterest;
            const diff = scInterest - baseInterest;

            let badgeClass = 'badge-current';
            let badgeText = 'Current';

            if (sc.rateOffset < 0) {
                badgeClass = 'badge-lower';
                badgeText = `${sc.rateOffset}%`;
            } else if (sc.rateOffset > 0) {
                badgeClass = 'badge-higher';
                badgeText = `+${sc.rateOffset}%`;
            }

            const diffText = sc.isCurrent 
                ? '—' 
                : (diff >= 0 ? `+${formatCurrency(diff)}` : `-${formatCurrency(Math.abs(diff))}`);
            
            const diffColor = sc.isCurrent 
                ? '' 
                : (diff >= 0 ? 'color: var(--interest-light); font-weight:700;' : 'color: #f87171; font-weight:700;');

            html += `
                <tr class="${sc.isCurrent ? 'current-scenario-row' : ''}">
                    <td>
                        <span class="scenario-badge ${badgeClass}">${badgeText}</span>
                        ${!sc.isCurrent ? `<span style="font-size:0.8rem; margin-left:0.35rem; color:var(--text-tertiary);">${sc.label}</span>` : ''}
                    </td>
                    <td><strong>${effectiveRate.toFixed(1)}%</strong></td>
                    <td>${formatCurrency(scInterest)}</td>
                    <td><strong>${formatCurrency(scTotal)}</strong></td>
                    <td style="${diffColor}">${diffText}</td>
                </tr>
            `;
        });

        dom.comparisonTableBody.innerHTML = html;
    };

    // --- Schedule Table Generation ---
    const updateScheduleTable = (P, R, rawTime, unit) => {
        let periods = Math.round(rawTime);
        if (periods <= 0) periods = 1;

        // If unit is months, create monthly periods (cap to 60 for table sanity if > 60)
        const isMonths = unit === 'months';
        const displayPeriods = isMonths ? Math.min(periods, 120) : Math.min(periods, 40);

        const periodInterest = isMonths
            ? (P * R * (1 / 12)) / 100
            : (P * R * 1) / 100;

        let cumulativeInterest = 0;
        let html = '';

        for (let i = 1; i <= displayPeriods; i++) {
            cumulativeInterest += periodInterest;
            const openingBalance = P + (cumulativeInterest - periodInterest);
            const closingBalance = P + cumulativeInterest;

            const periodLabel = isMonths ? `Month ${i}` : `Year ${i}`;

            html += `
                <tr>
                    <td><strong>${periodLabel}</strong></td>
                    <td>${formatCurrency(openingBalance)}</td>
                    <td style="color: var(--interest-light); font-weight: 600;">+${formatCurrency(periodInterest)}</td>
                    <td>${formatCurrency(cumulativeInterest)}</td>
                    <td><strong>${formatCurrency(closingBalance)}</strong></td>
                </tr>
            `;
        }

        dom.scheduleTableBody.innerHTML = html;

        // Apply collapsed style if needed
        applyTableCollapsedState(displayPeriods);
    };

    const applyTableCollapsedState = (totalRows) => {
        if (totalRows <= 5) {
            dom.toggleTableBtn.style.display = 'none';
            dom.scheduleTableContainer.classList.remove('collapsed');
        } else {
            dom.toggleTableBtn.style.display = 'inline-flex';
            if (state.isTableExpanded) {
                dom.scheduleTableContainer.classList.remove('collapsed');
                dom.toggleTableText.textContent = 'Collapse Table';
                dom.toggleTableBtn.querySelector('.chevron-toggle')?.classList.add('rotated');
            } else {
                dom.scheduleTableContainer.classList.add('collapsed');
                dom.toggleTableText.textContent = `Show All (${totalRows} Periods)`;
                dom.toggleTableBtn.querySelector('.chevron-toggle')?.classList.remove('rotated');
            }
        }
    };

    // --- Synchronize Inputs & Sliders ---
    // 1. Principal sync
    const setPrincipal = (val) => {
        let num = parseFloat(val);
        if (isNaN(num)) num = 0;
        state.principal = num;
        dom.principalInput.value = num;
        dom.principalSlider.value = Math.min(Math.max(num, 1000), 1000000);
        updateUI();
    };

    dom.principalInput.addEventListener('input', (e) => {
        setPrincipal(e.target.value);
    });

    dom.principalSlider.addEventListener('input', (e) => {
        setPrincipal(e.target.value);
    });

    // Quick Add Chips
    document.querySelectorAll('[data-add-principal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const addVal = parseFloat(btn.getAttribute('data-add-principal')) || 0;
            setPrincipal(state.principal + addVal);
            showToast(`Added ${state.currencySymbol}${formatNumber(addVal)} to principal`);
        });
    });

    // 2. Rate sync
    const setRate = (val) => {
        let num = parseFloat(val);
        if (isNaN(num)) num = 0;
        state.rate = num;
        dom.rateInput.value = num;
        dom.rateSlider.value = Math.min(Math.max(num, 0.5), 25);

        // Highlight preset buttons if exact match
        document.querySelectorAll('.rate-preset-btn').forEach(btn => {
            const btnRate = parseFloat(btn.getAttribute('data-set-rate'));
            if (Math.abs(btnRate - num) < 0.05) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        updateUI();
    };

    dom.rateInput.addEventListener('input', (e) => {
        setRate(e.target.value);
    });

    dom.rateSlider.addEventListener('input', (e) => {
        setRate(e.target.value);
    });

    // Rate Presets
    document.querySelectorAll('.rate-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const rateVal = parseFloat(btn.getAttribute('data-set-rate')) || 0;
            setRate(rateVal);
        });
    });

    // 3. Time Duration sync
    const setTime = (val) => {
        let num = parseFloat(val);
        if (isNaN(num)) num = 1;
        state.time = num;
        dom.timeInput.value = num;
        
        const maxLimit = state.timeUnit === 'years' ? 30 : 360;
        dom.timeSlider.value = Math.min(Math.max(num, 1), maxLimit);

        // Update duration chip active state
        document.querySelectorAll('.duration-chip').forEach(chip => {
            const chipVal = parseFloat(chip.getAttribute('data-set-time'));
            if (chipVal === num && state.timeUnit === 'years') {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });

        updateUI();
    };

    dom.timeInput.addEventListener('input', (e) => {
        setTime(e.target.value);
    });

    dom.timeSlider.addEventListener('input', (e) => {
        setTime(e.target.value);
    });

    // Duration Chips
    document.querySelectorAll('.duration-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            if (state.timeUnit !== 'years') {
                switchTimeUnit('years');
            }
            const timeVal = parseFloat(chip.getAttribute('data-set-time')) || 1;
            setTime(timeVal);
        });
    });

    // Unit Toggle (Years vs Months)
    const switchTimeUnit = (unit) => {
        if (state.timeUnit === unit) return;
        state.timeUnit = unit;

        if (unit === 'years') {
            dom.unitYearsBtn.classList.add('active');
            dom.unitMonthsBtn.classList.remove('active');
            dom.timeUnitDisplay.textContent = 'Years';
            dom.timeSlider.min = '1';
            dom.timeSlider.max = '30';
            dom.timeSlider.step = '0.5';
            dom.timeInput.max = '40';
            // Convert current months to years
            setTime(Math.max(1, Math.round((state.time / 12) * 2) / 2));
        } else {
            dom.unitMonthsBtn.classList.add('active');
            dom.unitYearsBtn.classList.remove('active');
            dom.timeUnitDisplay.textContent = 'Months';
            dom.timeSlider.min = '1';
            dom.timeSlider.max = '360';
            dom.timeSlider.step = '1';
            dom.timeInput.max = '480';
            // Convert current years to months
            setTime(Math.round(state.time * 12));
        }
    };

    dom.unitYearsBtn.addEventListener('click', () => switchTimeUnit('years'));
    dom.unitMonthsBtn.addEventListener('click', () => switchTimeUnit('months'));

    // 4. Currency Selector
    dom.currencySelect.addEventListener('change', (e) => {
        state.currencySymbol = e.target.value;
        const selectedOption = e.target.options[e.target.selectedIndex];
        state.currencyCode = selectedOption.getAttribute('data-code') || 'USD';
        updateUI();
        showToast(`Currency changed to ${state.currencyCode} (${state.currencySymbol})`);
    });

    // 5. Reset Button
    dom.resetBtn.addEventListener('click', () => {
        state.principal = 50000;
        state.rate = 7.5;
        state.time = 5;
        state.timeUnit = 'years';
        dom.unitYearsBtn.classList.add('active');
        dom.unitMonthsBtn.classList.remove('active');
        dom.timeUnitDisplay.textContent = 'Years';
        dom.timeSlider.min = '1';
        dom.timeSlider.max = '30';
        dom.timeSlider.step = '0.5';

        dom.principalInput.value = 50000;
        dom.principalSlider.value = 50000;
        dom.rateInput.value = 7.5;
        dom.rateSlider.value = 7.5;
        dom.timeInput.value = 5;
        dom.timeSlider.value = 5;

        setRate(7.5);
        setTime(5);
        setPrincipal(50000);
        showToast('Calculator reset to defaults');
    });

    // 6. Schedule Table Collapse Toggle
    dom.toggleTableBtn.addEventListener('click', () => {
        state.isTableExpanded = !state.isTableExpanded;
        const currentPeriods = state.timeUnit === 'months' ? Math.min(state.time, 120) : Math.min(state.time, 40);
        applyTableCollapsedState(currentPeriods);
    });

    // 7. Copy Summary Button
    dom.copySummaryBtn.addEventListener('click', async () => {
        const results = calculateSimpleInterest();
        const durationText = `${state.time} ${state.timeUnit}`;
        const summaryText = `--- InterestPulse Simple Interest Summary ---
Principal Amount: ${formatCurrency(results.P)}
Annual Interest Rate: ${results.R}%
Duration: ${durationText}
---------------------------------------------
Total Simple Interest: ${formatCurrency(results.interest)}
Total Maturity Value: ${formatCurrency(results.totalAmount)}
Total Return (%): +${results.growthPct.toFixed(2)}%
Average Annual Return: ${formatCurrency(results.annualReturn)}/year
Generated on: ${new Date().toLocaleDateString()}`;

        try {
            await navigator.clipboard.writeText(summaryText);
            showToast('Summary copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = summaryText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Summary copied to clipboard!');
        }
    });

    // 8. Export CSV Schedule
    dom.exportCsvBtn.addEventListener('click', () => {
        const results = calculateSimpleInterest();
        let periods = Math.round(results.rawTime);
        if (periods <= 0) periods = 1;
        const isMonths = state.timeUnit === 'months';
        const displayPeriods = isMonths ? Math.min(periods, 240) : Math.min(periods, 50);

        const periodInterest = isMonths
            ? (results.P * results.R * (1 / 12)) / 100
            : (results.P * results.R * 1) / 100;

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Period,Opening Balance,Interest Added,Cumulative Interest,Closing Balance\r\n';

        let cumulative = 0;
        for (let i = 1; i <= displayPeriods; i++) {
            cumulative += periodInterest;
            const opening = results.P + (cumulative - periodInterest);
            const closing = results.P + cumulative;
            const period = isMonths ? `Month ${i}` : `Year ${i}`;
            csvContent += `"${period}","${opening.toFixed(2)}","${periodInterest.toFixed(2)}","${cumulative.toFixed(2)}","${closing.toFixed(2)}"\r\n`;
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Simple_Interest_Schedule_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Schedule exported as CSV!');
    });

    // 9. Print Schedule
    dom.printScheduleBtn.addEventListener('click', () => {
        window.print();
    });

    // 10. Dark / Light Theme Toggle
    const currentTheme = localStorage.getItem('interest_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    dom.themeToggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('interest_theme', newTheme);
        showToast(`Switched to ${newTheme} theme`);
    });

    // Initial calculation run
    updateUI();
});
