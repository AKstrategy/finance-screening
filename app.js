const { jsPDF } = window.jspdf;

/* ── Helpers ── */
function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }
function fmtDate(iso){ if(!iso) return '—'; const d=new Date(iso+'T00:00:00'); if(isNaN(d)) return iso;
  return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
function addMonths(iso,m){ const d=new Date(iso+'T00:00:00'); d.setMonth(d.getMonth()+m); return d.toISOString().slice(0,10); }
function esc(s){ return (s==null?'':String(s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ── Language system ── */
let lang = 'ru';
function t(k){ return (LANG[lang]||LANG.en)[k] || LANG.en[k] || k; }

const LANG = {
  en:{
    badge:'Internal · Sales', footnote:'No data leaves this browser — report is generated on your device.',
    getting_started:'Getting started', step_label:'Step', step_of:'of', done_label:'Done', results_label:'Results',
    confirm_restart:'Start a new screen? Current answers will be cleared.',
    btn_back:'← Back', btn_continue:'Continue →', btn_start_new:'↺ Start New Screen', btn_download:'⬇ Download PDF Report', btn_use_result:'Use this →',
    /* intro */
    intro_eyebrow:'Step 1 — Client details', intro_title:'Who are we screening?',
    intro_sub:'Filled in by the sales rep on the call. Nothing leaves this browser.',
    lbl_name:'Client name', lbl_email:'Email', lbl_phone:'Phone', lbl_date:'Date', lbl_optional:'(optional)',
    ph_name:'Maria Gonzalez', ph_email:'name@email.com', ph_phone:'(555) 555-5555',
    err_name:'Client name is required to continue.',
    /* interests */
    int_eyebrow:'Step 2 — What the client needs', int_title:'What is the client interested in?',
    int_sub:"Select all that apply — we'll screen for every product at once.",
    err_interests:'Select at least one option to continue.',
    int_personal_label:'Personal Financing', int_personal_desc:'Credit card or personal loan',
    int_business_label:'Business Financing', int_business_desc:'BLOC, MCA, or term loan',
    int_auto_fin_label:'Auto Loan Financing', int_auto_fin_desc:'New or used vehicle purchase',
    int_auto_refi_label:'Auto Loan Refinancing', int_auto_refi_desc:'Refinance an existing auto loan',
    int_cli_label:'Credit Limit Increase', int_cli_desc:'On an existing card',
    /* score */
    score_eyebrow:'Financial profile', score_title:'Credit score?',
    score_lt580_l:'Below 580', score_lt580_d:'Poor',
    score_580_l:'580 – 619', score_580_d:'Fair / poor',
    score_620_l:'620 – 679', score_620_d:'Fair to good',
    score_680_l:'680 – 699', score_680_d:'Good',
    score_700_l:'700 or above', score_700_d:'Very good to excellent',
    /* dti */
    dti_eyebrow:'Financial profile', dti_title:'Debt-to-income ratio (DTI)?',
    dti_sub:'Monthly debt payments ÷ gross monthly income. Use the calculator if the client is not sure.',
    dti_ok_l:'43% or below', dti_ok_d:'Comfortable — meets most lender requirements',
    dti_mid_l:'43% – 50%', dti_mid_d:'Borderline — may need compensating factors',
    dti_high_l:'Above 50%', dti_high_d:'High — limits most lending options',
    dti_calc_btn:'📊 Calculate DTI on the call',
    dti_s_income:'Monthly gross income', dti_s_debts:'Monthly debt payments',
    dti_r_income:'Gross income / month', dti_r_mortgage:'Mortgage or rent', dti_r_car:'Car loan(s)',
    dti_r_student:'Student loans', dti_r_cards:'Credit card minimums', dti_r_other:'Other debts',
    dti_result_lbl:'Calculated DTI',
    dti_band_ok:'≤ 43% — comfortable', dti_band_mid:'43–50% — borderline', dti_band_high:'> 50% — high risk',
    /* velocity */
    vel_eyebrow:'Financial profile', vel_title:'New credit applications in the last 12 months?',
    vel_low_l:'2 or fewer', vel_high_l:'3 or more', vel_high_d:'Application-velocity risk',
    /* employment */
    emp_eyebrow:'Financial profile', emp_title:'Employment / income history?',
    emp_2plus_l:'2 years or more, steady', emp_lt2_l:'Less than 2 years',
    /* cli questions */
    cli_age_eyebrow:'Credit limit increase', cli_age_title:'How long has the card been open?',
    cli_age_lt3_l:'Less than 3 months', cli_age_3to6_l:'3 to 6 months', cli_age_6plus_l:'6 months or more',
    cli_on_eyebrow:'Credit limit increase', cli_on_title:'Payment history on this card?',
    cli_on_yes_l:'All payments on time', cli_on_no_l:'Has missed / late payments',
    cli_ut_eyebrow:'Credit limit increase', cli_ut_title:'Current utilization on the card?',
    cli_ut_sub:'How much of the credit limit is currently in use.',
    cli_ut_u30_l:'Under 30%', cli_ut_o30_l:'30% or higher',
    /* business questions */
    b_tib_eyebrow:'Business financing', b_tib_title:'Time in business?',
    b_tib_lt3_l:'Less than 3 months', b_tib_3to6_l:'3 to 6 months', b_tib_6to12_l:'6 to 12 months',
    b_tib_1to2_l:'1 to 2 years', b_tib_2plus_l:'2 years or more',
    b_rev_eyebrow:'Business financing', b_rev_title:'Annual business revenue?',
    b_rev_lt30_l:'Under $30K', b_rev_30to50_l:'$30K – $50K', b_rev_50to100_l:'$50K – $100K', b_rev_100plus_l:'$100K or more',
    b_dep_eyebrow:'Business — MCA', b_dep_title:'Average monthly bank deposits?',
    b_dep_sub:'MCA lenders look at deposit volume, not credit score.',
    b_dep_lt8_l:'Under $8K', b_dep_8to15_l:'$8K – $15K', b_dep_15plus_l:'$15K or more',
    b_acct_eyebrow:'Business — MCA', b_acct_title:'Business bank account open how long?',
    b_acct_lt3_l:'Less than 3 months', b_acct_3plus_l:'3 months or more',
    b_cons_eyebrow:'Business — MCA', b_cons_title:'Are deposits consistent month to month?',
    b_cons_yes_l:'Yes — steady and predictable', b_cons_no_l:'No — irregular',
    b_flags_eyebrow:'Business — MCA', b_flags_title:'Any of these present?',
    b_flags_sub:'Open bankruptcy, unresolved lien/judgment, prior MCA default, or heavy stacking.',
    b_flags_none_l:'None of these apply', b_flags_some_l:'One or more present',
    b_docs_eyebrow:'Business — Term Loan', b_docs_title:'Documentation ready?',
    b_docs_sub:'Tax returns, financials, bank statements.',
    b_docs_yes_l:'Yes — full docs available', b_docs_no_l:'No / incomplete',
    /* auto financing questions */
    af_veh_eyebrow:'Auto Financing', af_veh_title:'New or used vehicle?',
    af_veh_new_l:'New vehicle', af_veh_used_l:'Used vehicle',
    af_down_eyebrow:'Auto Financing', af_down_title:'Down payment available?',
    af_down_0_l:'No down payment (0%)', af_down_5_l:'5% – 10%', af_down_10_l:'10% – 20%', af_down_20_l:'20% or more',
    /* auto refinancing questions */
    ar_vage_eyebrow:'Auto Refinancing', ar_vage_title:'How old is the vehicle?',
    ar_vage_lt5_l:'Under 5 years', ar_vage_5to10_l:'5 to 10 years', ar_vage_gt10_l:'Over 10 years',
    ar_bal_eyebrow:'Auto Refinancing', ar_bal_title:'Remaining loan balance?',
    ar_bal_lt5_l:'Under $5,000', ar_bal_5plus_l:'$5,000 or more',
    ar_hist_eyebrow:'Auto Refinancing', ar_hist_title:'Payment history on current auto loan?',
    ar_hist_clean_l:'All payments on time (6+ months)', ar_hist_missed_l:'Has missed / late payments',
    /* results UI */
    res_eyebrow:'AK Strategy — Pre-screen complete',
    res_note:'Full eligibility overview for all selected products.',
    pill_ok:'eligible', pill_warn:'borderline', pill_no:'not eligible',
    section_ok:'Eligible — proceed now', section_warn:'Borderline — needs review', section_no:'Not eligible at this time',
    lbl_factor:'Key factor', lbl_step:'Recommended next step',
    tag_ok:'Eligible — proceed', tag_warn:'Borderline — escalate', tag_no:'Not eligible at this time',
    fu_title:'Follow-up plan', fu_sub:'Re-engage when the client meets the threshold.',
    fu_recheck:'Re-check', fu_empty:'No follow-ups needed — all selected products are a go.',
    disclaimer:'Estimates based on general 2026 industry thresholds. Final eligibility depends on full underwriting review.',
    /* PDF */
    pdf_header_sub:'INTERNAL SALES PRE-SCREEN',
    pdf_section:'Financing Options Overview', pdf_fu_title:'Follow-up Plan',
    pdf_fu_sub:'Re-engage when client qualifies',
    pdf_fu_none:'No follow-ups needed — all selected products are a go.',
    pdf_disclaimer:'Estimates based on general 2026 industry thresholds. Final eligibility depends on full underwriting.',
    pdf_recheck:'Re-check:',
    /* evaluate — product names */
    prod_personal:'Personal Financing', prod_cli:'Credit Limit Increase',
    prod_bloc:'Business Line of Credit (BLOC)', prod_mca:'Merchant Cash Advance (MCA)',
    prod_term:'Business Term Loan (Bank)',
    prod_auto_fin:'Auto Loan Financing', prod_auto_refi:'Auto Loan Refinancing',
    /* evaluate — verdict level badges in PDF */
    lvl_ok:'LIKELY ELIGIBLE', lvl_warn:'BORDERLINE - NEEDS REVIEW', lvl_no:'NOT ELIGIBLE',
    /* evaluate — personal */
    p_f_lt580:'Score below 580 — does not meet prime-product thresholds.',
    p_s_lt580:'Decline prime products; offer a secured card or credit-builder loan.',
    p_f_580:'Score 580–619 — approvable for non-prime products at higher rates.',
    p_s_580:'Proceed with fair-credit options; set rate expectations.',
    p_f_620:'Score 620–679 — qualifies for standard personal financing at moderate rates.',
    p_s_620:'Proceed; rates improve meaningfully above 680.',
    p_f_680:'Score 680–699 — strong file, competitive rates.',
    p_f_700:'Score 700+ — qualifies for best rates and terms.',
    p_s_ok:'Proceed with prime products.',
    dti_high_f:' DTI above 50% — affordability is a major concern.',
    p_s_dti_no:'Decline until DTI improves.',
    p_s_dti_warn:' Verify affordability given high DTI.',
    dti_mid_f:' DTI 43–50% is borderline.',
    vel_f:' 3+ new credit applications in 12 months — velocity risk.',
    p_n_lt580:'Raise score to 580+ (then 700+ for best terms).',
    p_n_580:'Lift score toward 620+, then 700+ for best rates.',
    p_n_620:'Lift score above 680 for lower rates.',
    p_n_dti:'Bring DTI to 43% or below.',
    p_n_vel:'Avoid new applications for 6–12 months.',
    p_note_lt580:'Re-screen when score reaches 580+ (≈6 months of credit-building).',
    p_note_other:'Re-screen in ~3 months as score and DTI improve.',
    /* evaluate — CLI */
    cli_f_lt3:'Card open under 3 months — most issuers require 3–6 months.',
    cli_s_lt3:'Decline; revisit at the 3-month mark.',
    cli_n_lt3:'Card needs at least 3 months of history.',
    cli_note_lt3:'Re-check 3 months from today.',
    cli_f_3to6:'3–6 months history — possible only with soft-pull issuers (Amex, Chase, Citi, Discover).',
    cli_s_3to6:'Escalate: attempt soft-pull CLI; confirm clean payments first.',
    cli_n_3to6:'Reaches the 6-month window soon. Keep utilization under 30%.',
    cli_note_3to6:'Re-screen near the 6-month mark.',
    cli_f_dirty:'6+ months open but payment history is not clean.',
    cli_s_dirty:'Decline; rebuild on-time record before requesting.',
    cli_n_dirty:'Needs 6 consecutive on-time payments.',
    cli_note_dirty:'Re-screen after clean payment record established.',
    cli_f_util:'On-time and seasoned, but utilization is 30% or higher.',
    cli_s_util:'Pay card below 30% utilization first, then request.',
    cli_n_util:'Pay below 30% utilization.',
    cli_note_util:'Re-check after the next statement.',
    cli_f_ok:'6+ months open, on-time payments, utilization under 30%.',
    cli_s_ok:'Proceed. Submit the increase request — one per ~6 months.',
    /* evaluate — BLOC */
    bloc_f_both:'Owner score under 600 and under 3 months in business.',
    bloc_f_score:'Owner score under 600 — below BLOC minimum (~600+).',
    bloc_f_tib:'Under 3 months in business — lenders want 6–12+ months.',
    bloc_s_no:'Decline now; build the missing piece and revisit.',
    bloc_f_ok:'680+ score, 6+ months in business, $100K+ revenue — bank-grade BLOC criteria met.',
    bloc_s_ok:'Proceed; bank or fintech BLOC both in play.',
    bloc_f_base:'Meets baseline BLOC criteria — ',
    bloc_a_score:'score 600–679 favors fintech over banks. ',
    bloc_a_rev:'Revenue under the $100K banks prefer.',
    bloc_s_warn:'Escalate to fintech/non-bank BLOC; banks need $100K+ revenue and 680+.',
    bloc_f_border:'Borderline — ',
    bloc_a_tib:'only 3–6 months in business (6+ preferred); ',
    bloc_a_rev_lt30:'revenue under $30K (lenders want $30K+).',
    bloc_s_border:'Escalate to underwriting; needs more seasoning or revenue.',
    bloc_n_tooNew:'Reach 6 months in business.',
    bloc_n_3to6:'Reach the 6-month mark.',
    bloc_n_score_low:'Raise owner score to 600+ (680+ for banks).',
    bloc_n_score_mid:'Lift score to 680+ for bank BLOCs.',
    bloc_n_rev:'Grow annual revenue toward $100K.',
    bloc_note_tib:'Eligible for BLOC at the 6-month mark.',
    bloc_note_other:'Re-screen as score/revenue improve.',
    /* evaluate — MCA */
    mca_f_flags:'Auto-decline factor present (open bankruptcy, unresolved lien/judgment, prior MCA default, or heavy stacking).',
    mca_s_flags:'Decline; resolve the blocking item before any MCA submission.',
    mca_f_acct:'Business bank account under 3 months — funders require 3+ months of statements.',
    mca_s_acct:'Decline now; revisit once account has 3+ months of history.',
    mca_f_dep:'Deposits under ~$8K/month — below typical MCA appetite ($10K–$15K+; some accept $5K).',
    mca_s_dep:'Escalate to $5K-minimum funders; or grow deposits.',
    mca_f_cons:'Deposit volume is fine but month-to-month consistency is weak.',
    mca_s_cons:'Escalate; funders may offer a smaller advance against irregular deposits.',
    mca_f_ok:'$8K+ consistent deposits, 3+ months account history, no blocking flags. Credit score largely irrelevant for MCA.',
    mca_s_ok:'Proceed; MCA is revenue-driven and a strong fit.',
    mca_n_flags:'Clear the blocking item (bankruptcy/lien/default/stacking).',
    mca_n_acct:'Reach 3 months of bank-account history.',
    mca_n_dep:'Grow monthly deposits to ~$8K–$15K+.',
    mca_n_cons:'Establish steady month-to-month deposits.',
    mca_note:'Re-screen once deposits/account history meet MCA minimums.',
    /* evaluate — Term Loan */
    term_f_no:'Bank term loans require 3+ months in business and owner credit above 600.',
    term_s_no:'Decline; redirect to BLOC or MCA and revisit later.',
    term_f_ok:'2+ years in business, 680+ owner score, $100K+ revenue, full documentation.',
    term_s_ok:'Proceed to bank submission.',
    term_f_border:'Borderline — ',
    term_g_tib:'under 2 years in business', term_g_score:'owner credit below 680',
    term_g_rev:'revenue under $100K', term_g_docs:'incomplete documentation',
    term_s_border:'Escalate to underwriting; or pursue BLOC/MCA in the meantime.',
    term_n_tib:'Reach 2 years in business.', term_n_score:'Build owner credit to 680+.',
    term_n_rev:'Grow revenue to $100K+.', term_n_docs:'Assemble full docs (tax returns, financials, bank statements).',
    term_note:'Re-screen near the 2-year mark with full documentation.',
    /* evaluate — Auto Financing */
    af_f_lt580:'Score below 580 — most mainstream lenders decline; specialty subprime lenders available at very high rates.',
    af_s_lt580:'Escalate to subprime auto specialist; set rate expectations (18%+ APR).',
    af_f_580:'Score 580–619 — subprime auto financing available; expect 12–18%+ APR.',
    af_s_580:'Proceed with subprime/non-prime auto lenders; recommend 10%+ down to improve approval odds.',
    af_f_620:'Score 620–679 — standard auto financing eligible; moderate rates (7–12% APR).',
    af_s_620:'Proceed; shop credit unions and banks, not just dealership financing.',
    af_f_680:'Score 680–699 — good rate tier; competitive auto financing available.',
    af_f_700:'Score 700+ — qualifies for best available auto loan rates.',
    af_s_ok:'Proceed; recommend credit unions for lowest rates.',
    af_dti_high:' DTI above 50% — lenders may limit approved loan amount.',
    af_dti_mid:' DTI 43–50% — borderline; verify affordability.',
    af_down_flag:' No down payment increases lender risk and loan-to-value.',
    af_s_dti_no:'Decline or offer smaller loan amount; DTI is a major concern.',
    af_s_dti_warn:' Verify monthly payment is manageable given high DTI.',
    af_n_lt580:'Raise score to 580+ (then 620+ for standard rates).',
    af_n_580:'Lift score to 620+ for standard auto financing.',
    af_n_620:'Lift score to 680+ for better rates.',
    af_n_dti:'Bring DTI to 43% or below.',
    af_n_down:'Save at least a 10% down payment.',
    af_note_lt580:'Re-screen when score reaches 580+.',
    af_note_other:'Re-screen in ~3 months as score and DTI improve.',
    /* evaluate — Auto Refinancing */
    ar_f_gt10:'Vehicle over 10 years old — most lenders will not refinance older vehicles.',
    ar_s_gt10:'Decline refi; suggest accelerating payoff on current loan instead.',
    ar_f_lt5k:'Remaining balance under $5,000 — below the minimum most refi lenders require.',
    ar_s_lt5k:'Decline refi; balance is too small to refinance profitably.',
    ar_f_missed:'Missed or late payments on current loan — most lenders require clean payment history.',
    ar_s_missed:'Decline now; establish 6+ consecutive on-time payments first.',
    ar_f_lt580:'Score below 580 — refinancing options very limited; specialty lenders only.',
    ar_s_lt580:'Escalate to subprime refi specialist; or focus on credit repair.',
    ar_f_ok:'Eligible for auto loan refinancing — score, vehicle age, balance, and payment history all favorable.',
    ar_s_ok:'Proceed; compare rates from credit unions and online lenders.',
    ar_f_580:'Score 580–619 — limited refi lenders available; possible at higher rates.',
    ar_s_580:'Escalate to non-prime refi lenders; savings may be modest.',
    ar_f_620:'Score 620+ — standard refinancing options available.',
    ar_s_620:'Proceed; target credit unions for best refi rates.',
    ar_a_vage:' Vehicle 5–10 years old — fewer lenders available than for newer vehicles.',
    ar_n_lt580:'Raise score to 580+, then 620+ for standard refinancing.',
    ar_n_missed:'Establish 6+ consecutive on-time payments on current loan.',
    ar_n_gt10:'Accelerate payoff on the current loan.',
    ar_n_lt5k:'Continue current loan — balance is too low to refinance.',
    ar_note_refi:'Re-screen when score improves and payment history is clean.',
  },

  ru:{
    badge:'Внутренний · Продажи', footnote:'Данные не покидают браузер — отчёт создаётся на вашем устройстве.',
    getting_started:'Начало работы', step_label:'Шаг', step_of:'из', done_label:'Готово', results_label:'Результаты',
    confirm_restart:'Начать новую проверку? Все введённые данные будут удалены.',
    btn_back:'← Назад', btn_continue:'Продолжить →', btn_start_new:'↺ Новая проверка', btn_download:'⬇ Скачать PDF-отчёт', btn_use_result:'Применить →',
    /* intro */
    intro_eyebrow:'Шаг 1 — Данные клиента', intro_title:'Кого проверяем?',
    intro_sub:'Заполняется менеджером по продажам во время звонка. Данные не покидают браузер.',
    lbl_name:'Имя клиента', lbl_email:'Эл. почта', lbl_phone:'Телефон', lbl_date:'Дата', lbl_optional:'(необязательно)',
    ph_name:'Мария Иванова', ph_email:'name@email.com', ph_phone:'(555) 555-5555',
    err_name:'Введите имя клиента для продолжения.',
    /* interests */
    int_eyebrow:'Шаг 2 — Что нужно клиенту', int_title:'Что интересует клиента?',
    int_sub:'Выберите всё подходящее — проверим каждый продукт сразу.',
    err_interests:'Выберите хотя бы один вариант для продолжения.',
    int_personal_label:'Личное финансирование', int_personal_desc:'Кредитная карта или личный кредит',
    int_business_label:'Бизнес-финансирование', int_business_desc:'BLOC, MCA или срочный кредит',
    int_auto_fin_label:'Автокредит', int_auto_fin_desc:'Покупка нового или подержанного автомобиля',
    int_auto_refi_label:'Рефинансирование автокредита', int_auto_refi_desc:'Рефинансирование существующего автокредита',
    int_cli_label:'Увеличение кредитного лимита', int_cli_desc:'На существующей кредитной карте',
    /* score */
    score_eyebrow:'Финансовый профиль', score_title:'Кредитный рейтинг?',
    score_lt580_l:'Ниже 580', score_lt580_d:'Плохой',
    score_580_l:'580 – 619', score_580_d:'Неудовл. / плохой',
    score_620_l:'620 – 679', score_620_d:'Удовл. / хороший',
    score_680_l:'680 – 699', score_680_d:'Хороший',
    score_700_l:'700 и выше', score_700_d:'Очень хороший / отличный',
    /* dti */
    dti_eyebrow:'Финансовый профиль', dti_title:'Соотношение долга к доходу (DTI)?',
    dti_sub:'Ежемесячные платежи по долгам ÷ валовой ежемесячный доход. Используйте калькулятор, если клиент не знает DTI.',
    dti_ok_l:'43% и ниже', dti_ok_d:'Комфортный — соответствует большинству требований',
    dti_mid_l:'43% – 50%', dti_mid_d:'Пограничный — могут потребоваться компенсирующие факторы',
    dti_high_l:'Выше 50%', dti_high_d:'Высокий — ограничивает большинство продуктов',
    dti_calc_btn:'📊 Рассчитать DTI прямо сейчас',
    dti_s_income:'Валовой ежемесячный доход', dti_s_debts:'Ежемесячные платежи по долгам',
    dti_r_income:'Доход в месяц (до налогов)', dti_r_mortgage:'Ипотека или аренда', dti_r_car:'Автокредит(ы)',
    dti_r_student:'Студенческие кредиты', dti_r_cards:'Минимальные платежи по картам', dti_r_other:'Прочие долги',
    dti_result_lbl:'Рассчитанный DTI',
    dti_band_ok:'≤ 43% — комфортный', dti_band_mid:'43–50% — пограничный', dti_band_high:'> 50% — высокий риск',
    /* velocity */
    vel_eyebrow:'Финансовый профиль', vel_title:'Новые кредитные заявки за последние 12 месяцев?',
    vel_low_l:'2 или менее', vel_high_l:'3 и более', vel_high_d:'Риск частых заявок',
    /* employment */
    emp_eyebrow:'Финансовый профиль', emp_title:'История занятости / дохода?',
    emp_2plus_l:'2 года и более, стабильно', emp_lt2_l:'Менее 2 лет',
    /* cli questions */
    cli_age_eyebrow:'Увеличение кредитного лимита', cli_age_title:'Как давно открыта карта?',
    cli_age_lt3_l:'Менее 3 месяцев', cli_age_3to6_l:'От 3 до 6 месяцев', cli_age_6plus_l:'6 месяцев и более',
    cli_on_eyebrow:'Увеличение кредитного лимита', cli_on_title:'История платежей по карте?',
    cli_on_yes_l:'Все платежи своевременные', cli_on_no_l:'Есть просрочки / пропуски',
    cli_ut_eyebrow:'Увеличение кредитного лимита', cli_ut_title:'Текущая утилизация карты?',
    cli_ut_sub:'Какой процент кредитного лимита использован.',
    cli_ut_u30_l:'Менее 30%', cli_ut_o30_l:'30% и выше',
    /* business questions */
    b_tib_eyebrow:'Бизнес-финансирование', b_tib_title:'Срок работы бизнеса?',
    b_tib_lt3_l:'Менее 3 месяцев', b_tib_3to6_l:'От 3 до 6 месяцев', b_tib_6to12_l:'От 6 до 12 месяцев',
    b_tib_1to2_l:'От 1 до 2 лет', b_tib_2plus_l:'2 года и более',
    b_rev_eyebrow:'Бизнес-финансирование', b_rev_title:'Годовая выручка бизнеса?',
    b_rev_lt30_l:'Менее $30K', b_rev_30to50_l:'$30K – $50K', b_rev_50to100_l:'$50K – $100K', b_rev_100plus_l:'$100K и более',
    b_dep_eyebrow:'Бизнес — MCA', b_dep_title:'Среднемесячные поступления на счёт?',
    b_dep_sub:'Кредиторы MCA оценивают оборот, а не кредитный рейтинг.',
    b_dep_lt8_l:'Менее $8K', b_dep_8to15_l:'$8K – $15K', b_dep_15plus_l:'$15K и более',
    b_acct_eyebrow:'Бизнес — MCA', b_acct_title:'Как давно открыт бизнес-счёт?',
    b_acct_lt3_l:'Менее 3 месяцев', b_acct_3plus_l:'3 месяца и более',
    b_cons_eyebrow:'Бизнес — MCA', b_cons_title:'Стабильны ли поступления из месяца в месяц?',
    b_cons_yes_l:'Да — стабильные и предсказуемые', b_cons_no_l:'Нет — нестабильные',
    b_flags_eyebrow:'Бизнес — MCA', b_flags_title:'Есть ли хотя бы одно из следующего?',
    b_flags_sub:'Открытое банкротство, неурегулированный залог/решение суда, дефолт по MCA или накопленные авансы.',
    b_flags_none_l:'Ничего из перечисленного', b_flags_some_l:'Одно или несколько',
    b_docs_eyebrow:'Бизнес — Срочный кредит', b_docs_title:'Документация готова?',
    b_docs_sub:'Налоговые декларации, финансовая отчётность, банковские выписки.',
    b_docs_yes_l:'Да — полный пакет документов', b_docs_no_l:'Нет / неполный комплект',
    /* auto financing questions */
    af_veh_eyebrow:'Автокредит', af_veh_title:'Новый или подержанный автомобиль?',
    af_veh_new_l:'Новый автомобиль', af_veh_used_l:'Подержанный автомобиль',
    af_down_eyebrow:'Автокредит', af_down_title:'Размер первоначального взноса?',
    af_down_0_l:'Без первоначального взноса (0%)', af_down_5_l:'5% – 10%', af_down_10_l:'10% – 20%', af_down_20_l:'20% и более',
    /* auto refinancing questions */
    ar_vage_eyebrow:'Рефинансирование автокредита', ar_vage_title:'Возраст автомобиля?',
    ar_vage_lt5_l:'Менее 5 лет', ar_vage_5to10_l:'От 5 до 10 лет', ar_vage_gt10_l:'Более 10 лет',
    ar_bal_eyebrow:'Рефинансирование автокредита', ar_bal_title:'Остаток по кредиту?',
    ar_bal_lt5_l:'Менее $5 000', ar_bal_5plus_l:'$5 000 и более',
    ar_hist_eyebrow:'Рефинансирование автокредита', ar_hist_title:'История платежей по текущему автокредиту?',
    ar_hist_clean_l:'Все платежи своевременные (6+ месяцев)', ar_hist_missed_l:'Есть просрочки / пропуски',
    /* results UI */
    res_eyebrow:'AK Strategy — Проверка завершена',
    res_note:'Полный обзор права на все выбранные продукты.',
    pill_ok:'подходит', pill_warn:'пограничный', pill_no:'не подходит',
    section_ok:'Подходит — можно оформлять', section_warn:'Пограничный — требует рассмотрения', section_no:'Не подходит на данный момент',
    lbl_factor:'Ключевой фактор', lbl_step:'Рекомендуемый следующий шаг',
    tag_ok:'Подходит — продолжить', tag_warn:'Пограничный — передать', tag_no:'Не подходит на данный момент',
    fu_title:'План последующих действий', fu_sub:'Вернитесь к клиенту, когда он выполнит условия.',
    fu_recheck:'Повторная проверка', fu_empty:'Последующие действия не требуются — все продукты одобрены.',
    disclaimer:'Оценки основаны на общих отраслевых критериях 2026 года. Окончательное решение зависит от полного андеррайтинга.',
    /* PDF */
    pdf_header_sub:'ВНУТРЕННЯЯ ПРОВЕРКА · ДЛЯ КЛИЕНТА',
    pdf_section:'Обзор вариантов финансирования', pdf_fu_title:'План последующих действий',
    pdf_fu_sub:'Вернитесь к клиенту при соответствии требованиям',
    pdf_fu_none:'Последующие действия не требуются — все продукты одобрены.',
    pdf_disclaimer:'Оценки основаны на общих отраслевых критериях 2026 года. Окончательное право определяется андеррайтингом.',
    pdf_recheck:'Проверить:',
    /* evaluate — product names */
    prod_personal:'Личное финансирование', prod_cli:'Увеличение кредитного лимита',
    prod_bloc:'Бизнес-кредитная линия (BLOC)', prod_mca:'Аванс под торговый оборот (MCA)',
    prod_term:'Срочный бизнес-кредит (банковский)',
    prod_auto_fin:'Автокредит', prod_auto_refi:'Рефинансирование автокредита',
    /* evaluate — verdict level badges in PDF */
    lvl_ok:'ВЕРОЯТНО ОДОБРЕНО', lvl_warn:'ПОГРАНИЧНЫЙ — ТРЕБУЕТ РАССМОТРЕНИЯ', lvl_no:'НЕ СООТВЕТСТВУЕТ ТРЕБОВАНИЯМ',
    /* evaluate — personal */
    p_f_lt580:'Рейтинг ниже 580 — не соответствует требованиям стандартных продуктов.',
    p_s_lt580:'Отказать по стандартным продуктам; предложить защищённую карту или кредит-строитель.',
    p_f_580:'Рейтинг 580–619 — возможно одобрение нестандартных продуктов по повышенной ставке.',
    p_s_580:'Предложить продукты для клиентов с умеренным рейтингом; обсудить ожидания по ставке.',
    p_f_620:'Рейтинг 620–679 — соответствует стандартному личному финансированию по умеренной ставке.',
    p_s_620:'Продолжить; ставки заметно снижаются при рейтинге выше 680.',
    p_f_680:'Рейтинг 680–699 — сильный профиль, конкурентоспособная ставка.',
    p_f_700:'Рейтинг 700+ — соответствует условиям для лучших ставок.',
    p_s_ok:'Перейти к оформлению стандартных продуктов.',
    dti_high_f:' DTI выше 50% — серьёзные опасения по платёжеспособности.',
    p_s_dti_no:'Отказать до снижения DTI.',
    p_s_dti_warn:' Тщательно проверить платёжеспособность при высоком DTI.',
    dti_mid_f:' DTI 43–50% — пограничный уровень.',
    vel_f:' 3+ новых кредитных заявки за 12 месяцев — риск частых заявок.',
    p_n_lt580:'Поднять рейтинг до 580+ (затем до 700+ для лучших условий).',
    p_n_580:'Поднять рейтинг до 620+, затем до 700+ для лучших ставок.',
    p_n_620:'Поднять рейтинг выше 680 для снижения ставки.',
    p_n_dti:'Снизить DTI до 43% и ниже.',
    p_n_vel:'Не подавать новых заявок в течение 6–12 месяцев.',
    p_note_lt580:'Повторная проверка при рейтинге 580+ (≈6 месяцев построения кредитной истории).',
    p_note_other:'Повторная проверка через ~3 месяца по мере улучшения рейтинга и DTI.',
    /* evaluate — CLI */
    cli_f_lt3:'Карта открыта менее 3 месяцев — большинство эмитентов требуют 3–6 месяцев истории.',
    cli_s_lt3:'Отказать; вернуться через 3 месяца.',
    cli_n_lt3:'Карте требуется не менее 3 месяцев истории.',
    cli_note_lt3:'Повторная проверка через 3 месяца.',
    cli_f_3to6:'3–6 месяцев истории — возможно только у эмитентов без жёсткого запроса (Amex, Chase, Citi, Discover).',
    cli_s_3to6:'Передать: попробовать CLI без жёсткого запроса; подтвердить отсутствие просрочек.',
    cli_n_3to6:'Скоро достигнет 6-месячного порога. Держать утилизацию ниже 30%.',
    cli_note_3to6:'Повторная проверка ближе к 6-месячному порогу.',
    cli_f_dirty:'Карта открыта 6+ месяцев, но история платежей не чистая.',
    cli_s_dirty:'Отказать; восстановить историю своевременных платежей.',
    cli_n_dirty:'Требуется 6 последовательных своевременных платежей.',
    cli_note_dirty:'Повторная проверка после установления чистой кредитной истории.',
    cli_f_util:'Платежи своевременные, карта достаточно старая, но утилизация 30% и выше.',
    cli_s_util:'Сначала снизить утилизацию ниже 30%, затем подать запрос.',
    cli_n_util:'Снизить утилизацию ниже 30%.',
    cli_note_util:'Повторная проверка после следующей выписки.',
    cli_f_ok:'Карта открыта 6+ месяцев, платежи своевременные, утилизация ниже 30%.',
    cli_s_ok:'Продолжить. Подать запрос на увеличение лимита — раз в ~6 месяцев.',
    /* evaluate — BLOC */
    bloc_f_both:'Рейтинг владельца ниже 600 и менее 3 месяцев в бизнесе.',
    bloc_f_score:'Рейтинг владельца ниже 600 — ниже минимума для BLOC (~600+).',
    bloc_f_tib:'Менее 3 месяцев в бизнесе — кредиторы требуют 6–12+ месяцев.',
    bloc_s_no:'Отказать сейчас; устранить недостающее и вернуться.',
    bloc_f_ok:'Рейтинг 680+, 6+ месяцев в бизнесе, выручка $100K+ — соответствует требованиям банковского BLOC.',
    bloc_s_ok:'Продолжить; доступны банковский и финтех-BLOC.',
    bloc_f_base:'Соответствует базовым требованиям BLOC — ',
    bloc_a_score:'рейтинг 600–679 подходит для финтех, но не банков. ',
    bloc_a_rev:'Выручка ниже $100K, предпочитаемых банками.',
    bloc_s_warn:'Передать в финтех/небанковский BLOC; банки требуют $100K+ и рейтинг 680+.',
    bloc_f_border:'Пограничный случай — ',
    bloc_a_tib:'только 3–6 месяцев в бизнесе (предпочтительно 6+); ',
    bloc_a_rev_lt30:'выручка ниже $30K (кредиторы хотят $30K+).',
    bloc_s_border:'Передать на андеррайтинг; нужно больше истории или выручки.',
    bloc_n_tooNew:'Достичь 6 месяцев работы бизнеса.',
    bloc_n_3to6:'Достичь 6-месячного порога.',
    bloc_n_score_low:'Поднять рейтинг владельца до 600+ (680+ для банков).',
    bloc_n_score_mid:'Поднять рейтинг до 680+ для банковских BLOC.',
    bloc_n_rev:'Увеличить годовую выручку до $100K.',
    bloc_note_tib:'BLOC доступен при достижении 6-месячного порога.',
    bloc_note_other:'Повторная проверка при улучшении рейтинга/выручки.',
    /* evaluate — MCA */
    mca_f_flags:'Присутствует автоматический отказ: открытое банкротство, неурегулированный залог/решение, дефолт по MCA или накопленные авансы.',
    mca_s_flags:'Отказать; устранить блокирующий фактор перед любой заявкой MCA.',
    mca_f_acct:'Бизнес-счёт открыт менее 3 месяцев — кредиторы требуют 3+ месяцев выписок.',
    mca_s_acct:'Отказать; вернуться после 3 месяцев истории счёта.',
    mca_f_dep:'Поступления менее ~$8K/мес — ниже стандартного аппетита MCA ($10K–$15K+; некоторые от $5K).',
    mca_s_dep:'Передать к кредиторам с минимумом $5K; или наращивать поступления.',
    mca_f_cons:'Объём поступлений достаточный, но стабильность из месяца в месяц слабая.',
    mca_s_cons:'Передать; кредиторы могут предложить меньший аванс при нестабильных поступлениях.',
    mca_f_ok:'Поступления $8K+ стабильно, счёт 3+ месяцев, блокирующих факторов нет. Кредитный рейтинг для MCA не важен.',
    mca_s_ok:'Продолжить; MCA ориентирован на выручку и отлично подходит.',
    mca_n_flags:'Устранить блокирующий фактор (банкротство/залог/решение/дефолт/стекинг).',
    mca_n_acct:'Достичь 3 месяцев истории бизнес-счёта.',
    mca_n_dep:'Увеличить ежемесячные поступления до ~$8K–$15K+.',
    mca_n_cons:'Обеспечить стабильные поступления из месяца в месяц.',
    mca_note:'Повторная проверка после достижения минимумов по поступлениям/истории счёта.',
    /* evaluate — Term Loan */
    term_f_no:'Банковские срочные кредиты требуют 3+ месяцев в бизнесе и рейтинга владельца выше 600.',
    term_s_no:'Отказать; перенаправить на BLOC или MCA, вернуться позже.',
    term_f_ok:'2+ года в бизнесе, рейтинг владельца 680+, выручка $100K+, полный пакет документов.',
    term_s_ok:'Продолжить; подать заявку в банк.',
    term_f_border:'Пограничный случай — ',
    term_g_tib:'менее 2 лет в бизнесе', term_g_score:'рейтинг владельца ниже 680',
    term_g_rev:'выручка ниже $100K', term_g_docs:'неполный пакет документов',
    term_s_border:'Передать на андеррайтинг; или временно оформить BLOC/MCA.',
    term_n_tib:'Достичь 2 лет работы бизнеса.', term_n_score:'Поднять рейтинг владельца до 680+.',
    term_n_rev:'Увеличить выручку до $100K+.', term_n_docs:'Собрать полный пакет документов (декларации, отчётность, выписки).',
    term_note:'Повторная проверка ближе к 2-летнему рубежу с полным пакетом документов.',
    /* evaluate — Auto Financing */
    af_f_lt580:'Рейтинг ниже 580 — большинство стандартных кредиторов откажет; доступны специализированные субстандартные кредиторы по очень высоким ставкам.',
    af_s_lt580:'Передать специалисту по субстандартным автокредитам; обсудить ожидания по ставке (от 18%+ годовых).',
    af_f_580:'Рейтинг 580–619 — субстандартное автокредитование доступно; ожидаемая ставка 12–18%+ годовых.',
    af_s_580:'Продолжить с субстандартными/нестандартными кредиторами; рекомендовать взнос 10%+ для повышения шансов одобрения.',
    af_f_620:'Рейтинг 620–679 — стандартное автокредитование доступно; умеренная ставка (7–12% годовых).',
    af_s_620:'Продолжить; рекомендовать кредитные союзы и банки, а не дилерское финансирование.',
    af_f_680:'Рейтинг 680–699 — хороший уровень; конкурентоспособное автокредитование доступно.',
    af_f_700:'Рейтинг 700+ — соответствует условиям для лучших ставок по автокредиту.',
    af_s_ok:'Продолжить; рекомендовать кредитные союзы для минимальных ставок.',
    af_dti_high:' DTI выше 50% — кредиторы могут ограничить одобренную сумму кредита.',
    af_dti_mid:' DTI 43–50% — пограничный; проверить платёжеспособность.',
    af_down_flag:' Отсутствие первоначального взноса увеличивает риск и коэффициент LTV для кредитора.',
    af_s_dti_no:'Отказать или предложить меньшую сумму кредита; DTI вызывает серьёзные опасения.',
    af_s_dti_warn:' Убедиться, что ежемесячный платёж посилен при высоком DTI.',
    af_n_lt580:'Поднять рейтинг до 580+ (затем до 620+ для стандартных ставок).',
    af_n_580:'Поднять рейтинг до 620+ для стандартного автокредитования.',
    af_n_620:'Поднять рейтинг до 680+ для более низкой ставки.',
    af_n_dti:'Снизить DTI до 43% и ниже.',
    af_n_down:'Накопить первоначальный взнос не менее 10%.',
    af_note_lt580:'Повторная проверка при достижении рейтинга 580+.',
    af_note_other:'Повторная проверка через ~3 месяца по мере улучшения рейтинга и DTI.',
    /* evaluate — Auto Refinancing */
    ar_f_gt10:'Автомобиль старше 10 лет — большинство кредиторов откажут в рефинансировании.',
    ar_s_gt10:'Отказать в рефинансировании; предложить ускорить погашение текущего кредита.',
    ar_f_lt5k:'Остаток по кредиту менее $5 000 — ниже минимального порога большинства кредиторов.',
    ar_s_lt5k:'Отказать в рефинансировании; остаток слишком мал для выгодного рефинансирования.',
    ar_f_missed:'Есть просрочки по текущему кредиту — большинство кредиторов требуют чистую историю платежей.',
    ar_s_missed:'Отказать; установить 6+ последовательных своевременных платежей.',
    ar_f_lt580:'Рейтинг ниже 580 — варианты рефинансирования очень ограничены; только специализированные кредиторы.',
    ar_s_lt580:'Передать специалисту по субстандартному рефинансированию; или сосредоточиться на восстановлении кредитной истории.',
    ar_f_ok:'Подходит для рефинансирования автокредита — рейтинг, возраст авто, остаток и история платежей соответствуют требованиям.',
    ar_s_ok:'Продолжить; сравнить ставки кредитных союзов и онлайн-кредиторов.',
    ar_f_580:'Рейтинг 580–619 — ограниченный выбор кредиторов; рефинансирование возможно по повышенной ставке.',
    ar_s_580:'Передать нестандартным кредиторам; экономия может быть незначительной.',
    ar_f_620:'Рейтинг 620+ — доступны стандартные варианты рефинансирования.',
    ar_s_620:'Продолжить; ориентироваться на кредитные союзы для лучших ставок.',
    ar_a_vage:' Автомобилю от 5 до 10 лет — кредиторов меньше, чем для более новых авто.',
    ar_n_lt580:'Поднять рейтинг до 580+, затем до 620+ для стандартного рефинансирования.',
    ar_n_missed:'Установить 6+ последовательных своевременных платежей по текущему кредиту.',
    ar_n_gt10:'Ускорить погашение текущего кредита.',
    ar_n_lt5k:'Продолжать текущий кредит — остаток слишком мал для рефинансирования.',
    ar_note_refi:'Повторная проверка при улучшении рейтинга и чистой истории платежей.',
  }
};

/* ── State ── */
const S = {
  client:  { name:'', email:'', phone:'', date:todayISO() },
  answers: { interests:[] }
};

/* ── DOM ── */
const mainEl    = document.getElementById('main');
const bar       = document.getElementById('bar');
const stepName  = document.getElementById('stepName');
const stepCount = document.getElementById('stepCount');
let history = [];

/* ── Language toggle ── */
function setLang(l){
  lang = l;
  document.documentElement.lang = l;
  const btn = document.getElementById('langToggle');
  if(btn) btn.textContent = l==='ru' ? 'EN' : 'RU';
  const badge = document.getElementById('hdrBadge');
  if(badge) badge.textContent = t('badge');
  const fn = document.getElementById('footNote');
  if(fn) fn.textContent = t('footnote');
  render();
}
document.getElementById('langToggle').addEventListener('click',()=>setLang(lang==='ru'?'en':'ru'));

/* ── Plan ── */
function buildPlan(){
  const a=S.answers, i=a.interests||[];
  const plan=['intro','interests'];
  if(i.includes('personal')||i.includes('business')||i.includes('auto_fin')||i.includes('auto_refi')) plan.push('score');
  if(i.includes('personal')||i.includes('auto_fin')||i.includes('auto_refi')) plan.push('dti');
  if(i.includes('personal')) plan.push('velocity');
  if(i.includes('cli')){
    plan.push('cli_age');
    if(a.cli_age==='6plus') plan.push('cli_ontime');
    if(a.cli_age==='6plus'&&a.cli_ontime==='yes') plan.push('cli_util');
  }
  if(i.includes('business')) plan.push('b_tib','b_revann','b_mdeposit','b_acctage','b_consistent','b_flags','b_docs');
  if(i.includes('auto_fin')) plan.push('af_veh','af_down');
  if(i.includes('auto_refi')) plan.push('ar_vage','ar_bal','ar_hist');
  plan.push('results');
  return plan;
}

/* ── Screen helpers ── */
function card(inner){ return `<div class="q-card">${inner}</div>`; }

function choice(id, eyebrow, title, sub, options){
  const cur=S.answers[id];
  return {
    id, name:eyebrow,
    html: card(`
      <div class="q-eyebrow">${eyebrow}</div>
      <h2 class="q-title">${title}</h2>
      ${sub?`<p class="q-sub">${sub}`:''}${sub?'</p>':''}
      <div class="opts">
        ${options.map(o=>`
          <button class="opt${cur===o.val?' sel':''}" data-val="${o.val}">
            <span class="dot"></span>
            <span>${o.label}${o.desc?`<small>${o.desc}</small>`:''}</span>
          </button>`).join('')}
      </div>`),
    wire(el,advance){ el.querySelectorAll('.opt').forEach(b=>{ b.onclick=()=>{ S.answers[id]=b.dataset.val; advance(); }; }); },
    autoAdvance:true
  };
}

/* ── Screens ── */
const SCREENS = {

  intro(){
    const c=S.client;
    return {
      id:'intro', name:t('intro_eyebrow'),
      html: card(`
        <div class="q-eyebrow">${t('intro_eyebrow')}</div>
        <h2 class="q-title">${t('intro_title')}</h2>
        <p class="q-sub">${t('intro_sub')}</p>
        <div class="fields-grid">
          <div class="field full">
            <label>${t('lbl_name')}</label>
            <input id="f_name" type="text" placeholder="${esc(t('ph_name'))}" value="${esc(c.name)}" autocomplete="off">
          </div>
          <div class="field">
            <label>${t('lbl_email')} <span class="opt-tag">${t('lbl_optional')}</span></label>
            <input id="f_email" type="email" placeholder="${esc(t('ph_email'))}" value="${esc(c.email)}" autocomplete="off">
          </div>
          <div class="field">
            <label>${t('lbl_phone')} <span class="opt-tag">${t('lbl_optional')}</span></label>
            <input id="f_phone" type="tel" placeholder="${esc(t('ph_phone'))}" value="${esc(c.phone)}" autocomplete="off">
          </div>
          <div class="field">
            <label>${t('lbl_date')}</label>
            <input id="f_date" type="date" value="${c.date}">
          </div>
        </div>
        <div class="err" id="introErr">${t('err_name')}</div>`),
      wire(el){
        const save=()=>{
          S.client.name=el.querySelector('#f_name').value.trim();
          S.client.email=el.querySelector('#f_email').value.trim();
          S.client.phone=el.querySelector('#f_phone').value.trim();
          S.client.date=el.querySelector('#f_date').value||todayISO();
        };
        el.querySelectorAll('input').forEach(i=>i.addEventListener('input',save));
      },
      next(el){
        if(!el.querySelector('#f_name').value.trim()){ el.querySelector('#introErr').classList.add('show'); return false; }
        return true;
      }
    };
  },

  interests(){
    const cur=S.answers.interests||[];
    const opts=[
      {val:'personal',  icon:'💳', lk:'int_personal_label',  dk:'int_personal_desc'},
      {val:'business',  icon:'🏢', lk:'int_business_label',  dk:'int_business_desc'},
      {val:'auto_fin',  icon:'🚗', lk:'int_auto_fin_label',  dk:'int_auto_fin_desc'},
      {val:'auto_refi', icon:'🔄', lk:'int_auto_refi_label', dk:'int_auto_refi_desc'},
      {val:'cli',       icon:'⬆️', lk:'int_cli_label',       dk:'int_cli_desc'},
    ];
    return {
      id:'interests', name:t('int_eyebrow'),
      html: card(`
        <div class="q-eyebrow">${t('int_eyebrow')}</div>
        <h2 class="q-title">${t('int_title')}</h2>
        <p class="q-sub">${t('int_sub')}</p>
        <div class="check-grid">
          ${opts.map(o=>`
            <button class="check-opt${cur.includes(o.val)?' sel':''}" data-val="${o.val}">
              <span class="check-box">${cur.includes(o.val)?'✓':''}</span>
              <span class="check-label">
                <span class="check-icon">${o.icon}</span>
                ${t(o.lk)}<small>${t(o.dk)}</small>
              </span>
            </button>`).join('')}
        </div>
        <div class="err" id="intErr">${t('err_interests')}</div>`),
      wire(el){
        el.querySelectorAll('.check-opt').forEach(b=>{
          b.onclick=()=>{
            const val=b.dataset.val, arr=S.answers.interests||[], idx=arr.indexOf(val);
            if(idx===-1) arr.push(val); else arr.splice(idx,1);
            S.answers.interests=arr;
            b.classList.toggle('sel',arr.includes(val));
            b.querySelector('.check-box').textContent=arr.includes(val)?'✓':'';
          };
        });
      },
      next(el){
        if(!(S.answers.interests||[]).length){ el.querySelector('#intErr').classList.add('show'); return false; }
        return true;
      }
    };
  },

  score(){ return choice('score',t('score_eyebrow'),t('score_title'),'',[
    {val:'lt580',   label:t('score_lt580_l'), desc:t('score_lt580_d')},
    {val:'580to619',label:t('score_580_l'),   desc:t('score_580_d')},
    {val:'620to679',label:t('score_620_l'),   desc:t('score_620_d')},
    {val:'680to699',label:t('score_680_l'),   desc:t('score_680_d')},
    {val:'700plus', label:t('score_700_l'),   desc:t('score_700_d')},
  ]); },

  dti(){
    const cur=S.answers.dti;
    const bands=[
      {val:'ok',  label:t('dti_ok_l'),   desc:t('dti_ok_d')},
      {val:'mid', label:t('dti_mid_l'),  desc:t('dti_mid_d')},
      {val:'high',label:t('dti_high_l'), desc:t('dti_high_d')},
    ];
    return {
      id:'dti', name:t('dti_eyebrow'),
      html: card(`
        <div class="q-eyebrow">${t('dti_eyebrow')}</div>
        <h2 class="q-title">${t('dti_title')}</h2>
        <p class="q-sub">${t('dti_sub')}</p>
        <div class="opts">
          ${bands.map(o=>`
            <button class="opt${cur===o.val?' sel':''}" data-val="${o.val}">
              <span class="dot"></span><span>${o.label}<small>${o.desc}</small></span>
            </button>`).join('')}
        </div>
        <div class="dti-calc-wrap">
          <button class="dti-toggle" id="dtiToggle" type="button">
            <span>${t('dti_calc_btn')}</span><span class="dti-arr">▼</span>
          </button>
          <div class="dti-calc" id="dtiCalc">
            <div class="dti-sect">${t('dti_s_income')}</div>
            <div class="dti-row"><label>${t('dti_r_income')}</label><input type="number" id="dc_inc" placeholder="0" min="0" step="100"></div>
            <hr class="dti-divider">
            <div class="dti-sect">${t('dti_s_debts')}</div>
            <div class="dti-row"><label>${t('dti_r_mortgage')}</label><input type="number" id="dc_mort" placeholder="0" min="0" step="50"></div>
            <div class="dti-row"><label>${t('dti_r_car')}</label><input type="number" id="dc_car" placeholder="0" min="0" step="50"></div>
            <div class="dti-row"><label>${t('dti_r_student')}</label><input type="number" id="dc_stu" placeholder="0" min="0" step="50"></div>
            <div class="dti-row"><label>${t('dti_r_cards')}</label><input type="number" id="dc_crd" placeholder="0" min="0" step="25"></div>
            <div class="dti-row"><label>${t('dti_r_other')}</label><input type="number" id="dc_oth" placeholder="0" min="0" step="25"></div>
            <div class="dti-result-bar">
              <div>
                <div class="dti-result-lbl">${t('dti_result_lbl')}</div>
                <div class="dti-pct" id="dtiPct">—</div>
                <div class="dti-band-note" id="dtiBand"></div>
              </div>
              <button class="dti-use-btn" id="dtiUseBtn" type="button" disabled>${t('btn_use_result')}</button>
            </div>
          </div>
        </div>`),
      wire(el,advance){
        el.querySelectorAll('.opt').forEach(b=>{ b.onclick=()=>{ S.answers.dti=b.dataset.val; advance(); }; });
        const tog=el.querySelector('#dtiToggle'), calc=el.querySelector('#dtiCalc');
        tog.onclick=()=>{ tog.classList.toggle('open'); calc.classList.toggle('open'); };
        const ids=['dc_inc','dc_mort','dc_car','dc_stu','dc_crd','dc_oth'];
        const inputs=ids.map(id=>el.querySelector('#'+id));
        const pctEl=el.querySelector('#dtiPct'), bandEl=el.querySelector('#dtiBand'), useBtn=el.querySelector('#dtiUseBtn');
        function recalc(){
          const inc=parseFloat(inputs[0].value)||0;
          const debts=inputs.slice(1).reduce((s,i)=>s+(parseFloat(i.value)||0),0);
          if(inc<=0){ pctEl.textContent='—'; pctEl.className='dti-pct'; bandEl.textContent=''; useBtn.disabled=true; return; }
          const pct=debts/inc*100, band=pct<=43?'ok':pct<=50?'mid':'high';
          pctEl.textContent=pct.toFixed(1)+'%'; pctEl.className='dti-pct '+band;
          bandEl.textContent=t('dti_band_'+band); useBtn.disabled=false; useBtn.dataset.band=band;
        }
        inputs.forEach(i=>i.addEventListener('input',recalc));
        useBtn.onclick=()=>{ S.answers.dti=useBtn.dataset.band; advance(); };
      },
      autoAdvance:true
    };
  },

  velocity(){ return choice('velocity',t('vel_eyebrow'),t('vel_title'),'',[
    {val:'low', label:t('vel_low_l')},
    {val:'high',label:t('vel_high_l'), desc:t('vel_high_d')},
  ]); },
  employment(){ return choice('employment',t('emp_eyebrow'),t('emp_title'),'',[
    {val:'2plus',label:t('emp_2plus_l')},
    {val:'lt2',  label:t('emp_lt2_l')},
  ]); },
  cli_age(){ return choice('cli_age',t('cli_age_eyebrow'),t('cli_age_title'),'',[
    {val:'lt3',  label:t('cli_age_lt3_l')},
    {val:'3to6', label:t('cli_age_3to6_l')},
    {val:'6plus',label:t('cli_age_6plus_l')},
  ]); },
  cli_ontime(){ return choice('cli_ontime',t('cli_on_eyebrow'),t('cli_on_title'),'',[
    {val:'yes',label:t('cli_on_yes_l')},
    {val:'no', label:t('cli_on_no_l')},
  ]); },
  cli_util(){ return choice('cli_util',t('cli_ut_eyebrow'),t('cli_ut_title'),t('cli_ut_sub'),[
    {val:'under30',label:t('cli_ut_u30_l')},
    {val:'over30', label:t('cli_ut_o30_l')},
  ]); },
  b_tib(){ return choice('b_tib',t('b_tib_eyebrow'),t('b_tib_title'),'',[
    {val:'lt3',  label:t('b_tib_lt3_l')},{val:'3to6', label:t('b_tib_3to6_l')},
    {val:'6to12',label:t('b_tib_6to12_l')},{val:'1to2', label:t('b_tib_1to2_l')},
    {val:'2plus',label:t('b_tib_2plus_l')},
  ]); },
  b_revann(){ return choice('b_revann',t('b_rev_eyebrow'),t('b_rev_title'),'',[
    {val:'lt30',   label:t('b_rev_lt30_l')},{val:'30to50', label:t('b_rev_30to50_l')},
    {val:'50to100',label:t('b_rev_50to100_l')},{val:'100plus',label:t('b_rev_100plus_l')},
  ]); },
  b_mdeposit(){ return choice('b_mdeposit',t('b_dep_eyebrow'),t('b_dep_title'),t('b_dep_sub'),[
    {val:'lt8',   label:t('b_dep_lt8_l')},{val:'8to15', label:t('b_dep_8to15_l')},
    {val:'15plus',label:t('b_dep_15plus_l')},
  ]); },
  b_acctage(){ return choice('b_acctage',t('b_acct_eyebrow'),t('b_acct_title'),'',[
    {val:'lt3',  label:t('b_acct_lt3_l')},{val:'3plus',label:t('b_acct_3plus_l')},
  ]); },
  b_consistent(){ return choice('b_consistent',t('b_cons_eyebrow'),t('b_cons_title'),'',[
    {val:'yes',label:t('b_cons_yes_l')},{val:'no',label:t('b_cons_no_l')},
  ]); },
  b_flags(){ return choice('b_flags',t('b_flags_eyebrow'),t('b_flags_title'),t('b_flags_sub'),[
    {val:'none',label:t('b_flags_none_l')},{val:'some',label:t('b_flags_some_l')},
  ]); },
  b_docs(){ return choice('b_docs',t('b_docs_eyebrow'),t('b_docs_title'),t('b_docs_sub'),[
    {val:'yes',label:t('b_docs_yes_l')},{val:'no',label:t('b_docs_no_l')},
  ]); },
  af_veh(){ return choice('af_veh',t('af_veh_eyebrow'),t('af_veh_title'),'',[
    {val:'new', label:t('af_veh_new_l')},
    {val:'used',label:t('af_veh_used_l')},
  ]); },
  af_down(){ return choice('af_down',t('af_down_eyebrow'),t('af_down_title'),'',[
    {val:'0',    label:t('af_down_0_l')},
    {val:'5to10',label:t('af_down_5_l')},
    {val:'10to20',label:t('af_down_10_l')},
    {val:'20plus',label:t('af_down_20_l')},
  ]); },
  ar_vage(){ return choice('ar_vage',t('ar_vage_eyebrow'),t('ar_vage_title'),'',[
    {val:'lt5',  label:t('ar_vage_lt5_l')},
    {val:'5to10',label:t('ar_vage_5to10_l')},
    {val:'gt10', label:t('ar_vage_gt10_l')},
  ]); },
  ar_bal(){ return choice('ar_bal',t('ar_bal_eyebrow'),t('ar_bal_title'),'',[
    {val:'lt5k', label:t('ar_bal_lt5_l')},
    {val:'5plus',label:t('ar_bal_5plus_l')},
  ]); },
  ar_hist(){ return choice('ar_hist',t('ar_hist_eyebrow'),t('ar_hist_title'),'',[
    {val:'clean', label:t('ar_hist_clean_l')},
    {val:'missed',label:t('ar_hist_missed_l')},
  ]); },
  results(){ return {id:'results',name:t('results_label'),results:true}; }
};

/* ── Eligibility engine ── */
function evaluate(){
  const out=[],follow=[];
  const a=S.answers,cd=S.client.date,i=a.interests||[];
  const push=(prod,level,factor,step)=>out.push({prod,level,factor,step});
  const score=a.score;
  const bizScore=['lt580','580to619'].includes(score)?'lt600':score==='620to679'?'600to679':'680plus';

  if(i.includes('personal')){
    let level,factor,step;
    if(score==='lt580'){level='no';factor=t('p_f_lt580');step=t('p_s_lt580');}
    else if(score==='580to619'){level='warn';factor=t('p_f_580');step=t('p_s_580');}
    else if(score==='620to679'){level='warn';factor=t('p_f_620');step=t('p_s_620');}
    else{level='ok';factor=score==='700plus'?t('p_f_700'):t('p_f_680');step=t('p_s_ok');}
    if(a.dti==='high'){
      if(level==='ok')level='warn';else if(level==='warn')level='no';
      factor+=t('dti_high_f');
      step=level==='no'?t('p_s_dti_no'):step+t('p_s_dti_warn');
    }else if(a.dti==='mid'&&level==='ok'){level='warn';factor+=t('dti_mid_f');}
    if(a.velocity==='high'){factor+=t('vel_f');if(level==='ok')level='warn';}
    push(t('prod_personal'),level,factor,step);
    if(level!=='ok'){
      const n=[];
      if(score==='lt580')n.push(t('p_n_lt580'));
      else if(score==='580to619')n.push(t('p_n_580'));
      else if(score==='620to679')n.push(t('p_n_620'));
      if(a.dti!=='ok')n.push(t('p_n_dti'));
      if(a.velocity==='high')n.push(t('p_n_vel'));
      follow.push({prod:t('prod_personal'),need:n.join(' '),
        date:addMonths(cd,score==='lt580'?6:3),
        note:score==='lt580'?t('p_note_lt580'):t('p_note_other')});
    }
  }

  if(i.includes('cli')){
    const prod=t('prod_cli');
    if(a.cli_age==='lt3'){
      push(prod,'no',t('cli_f_lt3'),t('cli_s_lt3'));
      follow.push({prod,need:t('cli_n_lt3'),date:addMonths(cd,3),note:t('cli_note_lt3')});
    }else if(a.cli_age==='3to6'){
      push(prod,'warn',t('cli_f_3to6'),t('cli_s_3to6'));
      follow.push({prod,need:t('cli_n_3to6'),date:addMonths(cd,3),note:t('cli_note_3to6')});
    }else{
      if(a.cli_ontime==='no'){push(prod,'no',t('cli_f_dirty'),t('cli_s_dirty'));follow.push({prod,need:t('cli_n_dirty'),date:addMonths(cd,6),note:t('cli_note_dirty')});}
      else if(a.cli_util==='over30'){push(prod,'warn',t('cli_f_util'),t('cli_s_util'));follow.push({prod,need:t('cli_n_util'),date:addMonths(cd,1),note:t('cli_note_util')});}
      else push(prod,'ok',t('cli_f_ok'),t('cli_s_ok'));
    }
  }

  if(i.includes('business')){
    /* BLOC */
    {
      const prod=t('prod_bloc');let level,factor,step;
      const tooNew=(a.b_tib==='lt3'),lowScore=(bizScore==='lt600');
      if(tooNew||lowScore){
        level='no';
        factor=lowScore&&tooNew?t('bloc_f_both'):lowScore?t('bloc_f_score'):t('bloc_f_tib');
        step=t('bloc_s_no');
      }else{
        const seasoned=['6to12','1to2','2plus'].includes(a.b_tib);
        const revOK=['30to50','50to100','100plus'].includes(a.b_revann);
        if(seasoned&&a.b_revann==='100plus'&&bizScore==='680plus'){level='ok';factor=t('bloc_f_ok');step=t('bloc_s_ok');}
        else if(seasoned&&revOK){
          level='warn';factor=t('bloc_f_base');
          factor+=bizScore==='600to679'?t('bloc_a_score'):'';
          factor+=['30to50','50to100'].includes(a.b_revann)?t('bloc_a_rev'):'';
          step=t('bloc_s_warn');
        }else{
          level='warn';factor=t('bloc_f_border');
          factor+=a.b_tib==='3to6'?t('bloc_a_tib'):'';
          factor+=a.b_revann==='lt30'?t('bloc_a_rev_lt30'):'';
          step=t('bloc_s_border');
        }
      }
      push(prod,level,factor,step);
      if(level!=='ok'){
        const n=[];let mDate=addMonths(cd,2);
        if(tooNew){n.push(t('bloc_n_tooNew'));mDate=addMonths(cd,5);}
        else if(a.b_tib==='3to6'){n.push(t('bloc_n_3to6'));mDate=addMonths(cd,2);}
        if(lowScore){n.push(t('bloc_n_score_low'));mDate=addMonths(cd,4);}
        else if(bizScore==='600to679')n.push(t('bloc_n_score_mid'));
        if(['lt30','30to50'].includes(a.b_revann))n.push(t('bloc_n_rev'));
        follow.push({prod,need:n.join(' '),date:mDate,note:tooNew||a.b_tib==='3to6'?t('bloc_note_tib'):t('bloc_note_other')});
      }
    }
    /* MCA */
    {
      const prod=t('prod_mca');let level,factor,step;
      if(a.b_flags==='some'){level='no';factor=t('mca_f_flags');step=t('mca_s_flags');}
      else if(a.b_acctage==='lt3'){level='no';factor=t('mca_f_acct');step=t('mca_s_acct');}
      else if(a.b_mdeposit==='lt8'){level='warn';factor=t('mca_f_dep');step=t('mca_s_dep');}
      else if(a.b_consistent==='no'){level='warn';factor=t('mca_f_cons');step=t('mca_s_cons');}
      else{level='ok';factor=t('mca_f_ok');step=t('mca_s_ok');}
      push(prod,level,factor,step);
      if(level!=='ok'){
        const n=[];let mDate=addMonths(cd,2);
        if(a.b_flags==='some'){n.push(t('mca_n_flags'));mDate=addMonths(cd,6);}
        if(a.b_acctage==='lt3'){n.push(t('mca_n_acct'));mDate=addMonths(cd,3);}
        if(a.b_mdeposit==='lt8')n.push(t('mca_n_dep'));
        if(a.b_consistent==='no')n.push(t('mca_n_cons'));
        follow.push({prod,need:n.join(' '),date:mDate,note:t('mca_note')});
      }
    }
    /* Term Loan */
    {
      const prod=t('prod_term');let level,factor,step;
      const yrs2=(a.b_tib==='2plus'),strongScore=(bizScore==='680plus'),strongRev=(a.b_revann==='100plus');
      if(a.b_tib==='lt3'||bizScore==='lt600'){level='no';factor=t('term_f_no');step=t('term_s_no');}
      else if(yrs2&&strongScore&&strongRev&&a.b_docs==='yes'){level='ok';factor=t('term_f_ok');step=t('term_s_ok');}
      else{
        level='warn';const g=[];
        if(!yrs2)g.push(t('term_g_tib'));if(!strongScore)g.push(t('term_g_score'));
        if(!strongRev)g.push(t('term_g_rev'));if(a.b_docs!=='yes')g.push(t('term_g_docs'));
        factor=t('term_f_border')+g.join(', ')+'.';step=t('term_s_border');
      }
      push(prod,level,factor,step);
      if(level!=='ok'){
        const n=[];let mDate=addMonths(cd,6);
        if(!yrs2){n.push(t('term_n_tib'));mDate=a.b_tib==='1to2'?addMonths(cd,6):addMonths(cd,12);}
        if(!strongScore)n.push(t('term_n_score'));
        if(!strongRev)n.push(t('term_n_rev'));
        if(a.b_docs!=='yes')n.push(t('term_n_docs'));
        follow.push({prod,need:n.join(' '),date:mDate,note:t('term_note')});
      }
    }
  }

  if(i.includes('auto_fin')){
    const prod=t('prod_auto_fin');let level,factor,step;
    if(score==='lt580'){level='no';factor=t('af_f_lt580');step=t('af_s_lt580');}
    else if(score==='580to619'){level='warn';factor=t('af_f_580');step=t('af_s_580');}
    else if(score==='620to679'){level='warn';factor=t('af_f_620');step=t('af_s_620');}
    else{level='ok';factor=score==='700plus'?t('af_f_700'):t('af_f_680');step=t('af_s_ok');}
    if(a.dti==='high'){
      if(level==='ok')level='warn';else if(level==='warn')level='no';
      factor+=t('af_dti_high');
      step=level==='no'?t('af_s_dti_no'):step+t('af_s_dti_warn');
    }else if(a.dti==='mid'&&level==='ok'){level='warn';factor+=t('af_dti_mid');}
    if(a.af_down==='0'&&level==='ok'){level='warn';factor+=t('af_down_flag');}
    push(prod,level,factor,step);
    if(level!=='ok'){
      const n=[];
      if(score==='lt580')n.push(t('af_n_lt580'));
      else if(score==='580to619')n.push(t('af_n_580'));
      else if(score==='620to679')n.push(t('af_n_620'));
      if(a.dti!=='ok')n.push(t('af_n_dti'));
      if(a.af_down==='0')n.push(t('af_n_down'));
      follow.push({prod,need:n.join(' '),
        date:addMonths(cd,score==='lt580'?6:3),
        note:score==='lt580'?t('af_note_lt580'):t('af_note_other')});
    }
  }

  if(i.includes('auto_refi')){
    const prod=t('prod_auto_refi');let level,factor,step;
    if(a.ar_vage==='gt10'){level='no';factor=t('ar_f_gt10');step=t('ar_s_gt10');}
    else if(a.ar_bal==='lt5k'){level='no';factor=t('ar_f_lt5k');step=t('ar_s_lt5k');}
    else if(a.ar_hist==='missed'){level='no';factor=t('ar_f_missed');step=t('ar_s_missed');}
    else if(score==='lt580'){level='no';factor=t('ar_f_lt580');step=t('ar_s_lt580');}
    else if(score==='580to619'){
      level='warn';factor=t('ar_f_580');
      if(a.ar_vage==='5to10')factor+=t('ar_a_vage');
      step=t('ar_s_580');
    }else{
      level='ok';factor=t('ar_f_620');
      if(a.ar_vage==='5to10')factor+=t('ar_a_vage');
      step=t('ar_s_620');
    }
    push(prod,level,factor,step);
    if(level!=='ok'){
      const n=[];
      if(a.ar_vage==='gt10')n.push(t('ar_n_gt10'));
      if(a.ar_bal==='lt5k')n.push(t('ar_n_lt5k'));
      if(a.ar_hist==='missed')n.push(t('ar_n_missed'));
      if(score==='lt580')n.push(t('ar_n_lt580'));
      follow.push({prod,need:n.join(' '),date:addMonths(cd,6),note:t('ar_note_refi')});
    }
  }

  return {out,follow};
}

/* ── Render results ── */
function lMeta(l){
  if(l==='ok')   return {icon:'✅',tag:t('tag_ok'),   cls:'ok'};
  if(l==='warn') return {icon:'⚠️',tag:t('tag_warn'), cls:'warn'};
  return                {icon:'❌',tag:t('tag_no'),   cls:'no'};
}
function vHTML(v){
  const m=lMeta(v.level);
  return `<div class="verdict ${m.cls}">
    <div class="v-top"><div class="v-icon">${m.icon}</div><div>
      <div class="v-prod">${esc(v.prod)}</div>
      <span class="v-tag ${m.cls}">${m.tag}</span>
    </div></div>
    <div class="v-row"><span class="lbl">${t('lbl_factor')}</span>${esc(v.factor)}</div>
    <div class="v-row"><span class="lbl">${t('lbl_step')}</span>${esc(v.step)}</div>
  </div>`;
}
function renderResults(el){
  const {out,follow}=evaluate(),c=S.client;
  const ok=out.filter(v=>v.level==='ok'),warn=out.filter(v=>v.level==='warn'),no=out.filter(v=>v.level==='no');
  const pills=[
    ok.length?  `<span class="pill ok">✅ ${ok.length} ${t('pill_ok')}</span>`:'',
    warn.length?`<span class="pill warn">⚠️ ${warn.length} ${t('pill_warn')}</span>`:'',
    no.length?  `<span class="pill no">❌ ${no.length} ${t('pill_no')}</span>`:'',
  ].join('');
  let html=`<div class="res-hero">
    <div class="q-eyebrow">${t('res_eyebrow')}</div>
    <div class="res-name">${esc(c.name||'—')}</div>
    <div class="res-meta">${[c.email,c.phone].filter(Boolean).map(esc).join(' · ')||'—'} · ${fmtDate(c.date)}</div>
    <div class="res-summary-pills">${pills}</div>
    <div class="res-note">${t('res_note')}</div>
  </div>`;
  if(ok.length){html+=`<div class="section-lbl">${t('section_ok')}</div>`;ok.forEach(v=>{html+=vHTML(v);});}
  if(warn.length){html+=`<div class="section-lbl">${t('section_warn')}</div>`;warn.forEach(v=>{html+=vHTML(v);});}
  if(no.length){html+=`<div class="section-lbl">${t('section_no')}</div>`;no.forEach(v=>{html+=vHTML(v);});}
  html+=`<div class="followup">
    <h3>📌 ${t('fu_title')}</h3><p class="fsub">${t('fu_sub')}</p>`;
  if(!follow.length){html+=`<div class="fu-empty">${t('fu_empty')}</div>`;}
  else follow.forEach(f=>{html+=`<div class="fu-item">
    <div class="fu-prod">${esc(f.prod)}</div>
    <div class="fu-need">${esc(f.need)}</div>
    <div class="fu-date">🗓 ${t('fu_recheck')} ${fmtDate(f.date)}</div>
  </div>`;});
  html+=`</div><p class="disclaimer">${t('disclaimer')}</p>
  <div class="result-actions">
    <button class="btn btn-gold" id="dlPdf">${t('btn_download')}</button>
    <button class="btn btn-ghost" id="startOver2">${t('btn_start_new')}</button>
  </div>`;
  el.innerHTML=html;
  el.querySelector('#dlPdf').onclick=async function(){
    const btn=this; btn.disabled=true; btn.textContent='⏳…';
    try{await generatePDF();}finally{btn.disabled=false;btn.textContent=t('btn_download');}
  };
  el.querySelector('#startOver2').onclick=startOver;
}

/* ── PDF ── */
function buildPdfHTML(out,follow){
  const c=S.client;
  const lcolor=l=>l==='ok'?'#059669':l==='warn'?'#d97706':'#dc2626';
  const llabel=l=>l==='ok'?t('lvl_ok'):l==='warn'?t('lvl_warn'):t('lvl_no');
  let cards='';
  ['ok','warn','no'].forEach(lvl=>{
    out.filter(v=>v.level===lvl).forEach(v=>{
      const lc=lcolor(lvl);
      cards+=`<div style="border:1px solid #e2e8f0;border-left:4px solid ${lc};border-radius:6px;margin-bottom:12px;padding:14px 16px;background:#fafafa;">
        <div style="font-size:13px;font-weight:700;margin-bottom:3px;">${esc(v.prod)}</div>
        <div style="font-size:9px;color:${lc};font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">${llabel(lvl)}</div>
        <div style="font-size:9px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;">${esc(t('lbl_factor'))}</div>
        <div style="font-size:11px;margin-bottom:8px;">${esc(v.factor)}</div>
        <div style="font-size:9px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;">${esc(t('lbl_step'))}</div>
        <div style="font-size:11px;">${esc(v.step)}</div>
      </div>`;
    });
  });
  let fuRows='';
  if(!follow.length){
    fuRows=`<div style="font-size:11px;color:#059669;padding:8px 0;">${esc(t('fu_empty'))}</div>`;
  }else{
    follow.forEach(f=>{
      fuRows+=`<div style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
        <div style="font-size:11px;font-weight:700;color:#c8972a;margin-bottom:3px;">${esc(f.prod)}</div>
        <div style="font-size:11px;margin-bottom:4px;">${esc(f.need)}</div>
        <div style="font-size:10px;color:#64748b;">🗓 ${esc(t('fu_recheck'))} ${fmtDate(f.date)}</div>
      </div>`;
    });
  }
  const contact=[c.email,c.phone].filter(Boolean).map(esc).join(' &nbsp;·&nbsp; ');
  return `<div style="width:750px;font-family:Arial,Helvetica,sans-serif;background:#fff;color:#0c1a2e;">
    <div style="background:#0c1a2e;padding:22px 48px;">
      <div style="display:inline-block;vertical-align:middle;background:#c8972a;width:36px;height:36px;border-radius:8px;text-align:center;line-height:36px;margin-right:12px;">
        <span style="color:#0c1a2e;font-weight:900;font-size:12px;">AK</span>
      </div>
      <div style="display:inline-block;vertical-align:middle;">
        <div style="color:#fff;font-size:17px;font-weight:700;">AK Strategy</div>
        <div style="color:#94a3b8;font-size:9px;letter-spacing:.08em;">${esc(t('pdf_header_sub'))}</div>
      </div>
    </div>
    <div style="padding:24px 48px 16px;border-bottom:1px solid #e2e8f0;">
      <div style="font-size:20px;font-weight:700;margin-bottom:4px;">${esc(c.name||'—')}</div>
      ${contact?`<div style="font-size:11px;color:#64748b;margin-bottom:2px;">${contact}</div>`:''}
      <div style="font-size:11px;color:#64748b;">${fmtDate(c.date)}</div>
    </div>
    <div style="padding:20px 48px 0;">
      <div style="font-size:13px;font-weight:700;margin-bottom:14px;">${esc(t('pdf_section'))}</div>
      ${cards}
    </div>
    <div style="padding:16px 48px 0;">
      <div style="background:#0c1a2e;border-radius:6px;padding:12px 16px;margin-bottom:12px;">
        <span style="color:#fff;font-weight:700;font-size:12px;">${esc(t('pdf_fu_title'))}</span>
      </div>
      ${fuRows}
    </div>
    <div style="padding:20px 48px 32px;margin-top:16px;border-top:1px solid #e2e8f0;">
      <div style="font-size:8px;color:#94a3b8;font-style:italic;">${esc(t('pdf_disclaimer'))}</div>
      <div style="font-size:10px;color:#c8972a;font-weight:700;margin-top:6px;">AK Strategy</div>
    </div>
  </div>`;
}

async function generatePDF(){
  const {out,follow}=evaluate();
  const c=S.client;
  const wrap=document.createElement('div');
  wrap.style.cssText='position:absolute;left:-9999px;top:0;';
  wrap.innerHTML=buildPdfHTML(out,follow);
  document.body.appendChild(wrap);
  try{
    const canvas=await html2canvas(wrap.firstChild,{scale:2,useCORS:true,logging:false,backgroundColor:'#ffffff'});
    document.body.removeChild(wrap);
    const doc=new jsPDF({unit:'pt',format:'letter'});
    const pageW=doc.internal.pageSize.getWidth();
    const pageH=doc.internal.pageSize.getHeight();
    const ratio=canvas.width/pageW;
    const pageSliceH=pageH*ratio;
    let offset=0,first=true;
    while(offset<canvas.height){
      if(!first)doc.addPage(); first=false;
      const sliceH=Math.min(pageSliceH,canvas.height-offset);
      const sc=document.createElement('canvas');
      sc.width=canvas.width; sc.height=sliceH;
      const ctx=sc.getContext('2d');
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,sc.width,sliceH);
      ctx.drawImage(canvas,0,-offset);
      doc.addImage(sc.toDataURL('image/jpeg',0.93),'JPEG',0,0,pageW,sliceH/ratio);
      offset+=pageSliceH;
    }
    const safe=(c.name||'client').replace(/[^a-z0-9а-яёА-ЯЁ]+/gi,'_').replace(/^_|_$/g,'');
    doc.save('AKStrategy_'+safe+'_'+c.date+'.pdf');
  }catch(e){
    document.body.contains(wrap)&&document.body.removeChild(wrap);
    alert('PDF error: '+e.message);
  }
}

/* ── Navigation ── */
function currentScreen(){ return history[history.length-1]; }
function go(id){ history.push(id); render(); }
function back(){ if(history.length<=1)return; history.pop(); render(); }
function startOver(){
  if(history.length>1&&!confirm(t('confirm_restart')))return;
  S.client={name:'',email:'',phone:'',date:todayISO()};
  S.answers={interests:[]};
  history=['intro'];
  render();
}
function advanceFrom(id){
  const plan=buildPlan(),next=plan[plan.indexOf(id)+1];
  if(next)go(next);
}
function render(){
  const stepId=currentScreen(),plan=buildPlan();
  const idx=Math.max(0,plan.indexOf(stepId));
  bar.style.width=(stepId==='results'?100:Math.round(idx/(plan.length-1)*100))+'%';
  const def=SCREENS[stepId]();
  stepName.textContent=stepId==='results'?t('results_label'):def.name;
  stepCount.textContent=stepId==='results'?t('done_label'):t('step_label')+' '+(idx+1)+' '+t('step_of')+' '+plan.length;
  if(def.results){
    mainEl.innerHTML=`<div class="screen active" id="scr"></div>`;
    renderResults(document.getElementById('scr'));
    window.scrollTo({top:0,behavior:'smooth'});return;
  }
  const isAuto=def.autoAdvance;
  const navHTML=`<div class="nav">
    ${history.length>1?`<button class="btn btn-ghost" id="backBtn">${t('btn_back')}</button>`:''}
    ${!isAuto?`<button class="btn btn-primary" id="nextBtn">${t('btn_continue')}</button>`:''}
    <button class="btn btn-ghost" id="restartBtn">↺</button>
  </div>`;
  mainEl.innerHTML=`<div class="screen active" id="scr">${def.html}${navHTML}</div>`;
  const el=document.getElementById('scr');
  if(def.wire)def.wire(el,()=>advanceFrom(stepId));
  const bb=el.querySelector('#backBtn');if(bb)bb.onclick=back;
  const rb=el.querySelector('#restartBtn');if(rb)rb.onclick=startOver;
  const nb=el.querySelector('#nextBtn');
  if(nb)nb.onclick=()=>{if(def.next&&!def.next(el))return;advanceFrom(stepId);};
  window.scrollTo({top:0,behavior:'smooth'});
}

/* boot */
history=['intro'];
setLang('ru');
