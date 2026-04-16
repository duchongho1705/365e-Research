<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>365 Energy - Executive Brand Strategy 2026</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
            -webkit-font-smoothing: antialiased;
            color: #0f172a;
        }
        
        /* Smooth Tab Transitions */
        .tab-content {
            display: none;
            opacity: 0;
            transform: translateY(15px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .tab-content.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }

        /* Elegant Staggered Animations */
        .animate-stagger > * {
            opacity: 0;
            transform: translateY(15px);
            animation: slideFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
        .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
        .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
        .animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }
        .animate-stagger > *:nth-child(5) { animation-delay: 0.5s; }

        @keyframes slideFadeUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 365 Energy Brand Colors & Gradients */
        .brand-gradient {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        }
        
        .sidebar-gradient {
            background: linear-gradient(180deg, #022c22 0%, #064e3b 100%);
        }

        /* Premium Card Effects */
        .card-premium {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 1.25rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-premium:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.05), 0 10px 10px -5px rgba(16, 185, 129, 0.02);
            border-color: rgba(16, 185, 129, 0.4);
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        /* Typography & Structure Helpers */
        .section-tag {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.375rem 1.25rem;
            border-radius: 9999px;
            background-color: rgba(16, 185, 129, 0.1);
            color: #047857;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 1.25rem;
        }

        .customer-centric-border {
            position: relative;
            overflow: hidden;
        }
        .customer-centric-border::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 4px;
            height: 100%;
            background: #10b981;
        }
        
        /* Logic Connector Line */
        .logic-connector {
            position: relative;
        }
        .logic-connector::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 20px;
            background: #cbd5e1;
        }
    </style>
</head>
<body class="selection:bg-emerald-200 selection:text-emerald-900">

<div class="flex h-screen w-full">
    
    <!-- Premium Sidebar -->
    <aside class="w-72 sidebar-gradient text-slate-300 flex flex-col shadow-2xl z-20 hidden md:flex shrink-0">
        <div class="p-8 pb-6">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-emerald-900/50">
                    <i data-lucide="zap" class="text-white w-5 h-5"></i>
                </div>
                <h1 class="text-2xl font-bold tracking-tight text-white">365 ENERGY</h1>
            </div>
            <p class="text-[10px] text-emerald-300 font-bold tracking-widest uppercase opacity-90 mt-1">Brand Strategy Board 2026</p>
        </div>
        
        <nav class="flex-1 overflow-y-auto py-4 px-4 space-y-2">
            <button onclick="switchTab('context')" class="tab-btn w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 bg-emerald-500/20 text-emerald-50 border border-emerald-500/30" data-target="context">
                <i data-lucide="line-chart" class="w-4 h-4"></i>
                1. Định Hướng Từ Khách Hàng
            </button>
            
            <button onclick="switchTab('competitors')" class="tab-btn w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 text-emerald-100/70 hover:bg-emerald-500/10 hover:text-emerald-50 border border-transparent" data-target="competitors">
                <i data-lucide="crosshair" class="w-4 h-4"></i>
                2. Khoảng Trống Thị Trường
            </button>
            
            <button onclick="switchTab('positioning')" class="tab-btn w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 text-emerald-100/70 hover:bg-emerald-500/10 hover:text-emerald-50 border border-transparent" data-target="positioning">
                <i data-lucide="compass" class="w-4 h-4"></i>
                3. Chiến Lược Định Vị
            </button>
            
            <button onclick="switchTab('profile')" class="tab-btn w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 text-emerald-100/70 hover:bg-emerald-500/10 hover:text-emerald-50 border border-transparent" data-target="profile">
                <i data-lucide="layout-template" class="w-4 h-4"></i>
                4. Kiến Trúc HSNL
            </button>
        </nav>

        <div class="p-6 bg-black/20 border-t border-white/5">
            <div class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <i data-lucide="briefcase" class="w-4 h-4"></i>
                </div>
                <div>
                    <p class="text-xs font-bold text-white tracking-wide">AGENCY REPORT</p>
                    <p class="text-[10px] text-emerald-200/60 uppercase tracking-wider mt-0.5">Strictly Confidential</p>
                </div>
            </div>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50">
        
        <header class="md:hidden sidebar-gradient px-6 py-4 flex justify-between items-center z-10 sticky top-0 shadow-md">
            <div class="flex items-center gap-2">
                <i data-lucide="zap" class="text-emerald-400 w-5 h-5"></i>
                <h1 class="text-lg font-bold text-white">365 ENERGY</h1>
            </div>
            <button class="text-emerald-100 hover:text-white"><i data-lucide="menu"></i></button>
        </header>

        <div class="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 scroll-smooth bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')]">
            <div class="max-w-5xl mx-auto pb-24">

                <!-- TAB 1: DỮ LIỆU & BỐI CẢNH (Customer-Centric) -->
                <section id="context" class="tab-content active">
                    <header class="mb-14 text-center md:text-left">
                        <div class="section-tag inline-flex">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Nguyên lý Customer-Centric
                        </div>
                        <h2 class="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">Mọi Chiến Lược Đều Bắt Đầu<br/>Từ Bài Toán Của Khách Hàng</h2>
                        <p class="text-base text-slate-600 max-w-3xl leading-relaxed mx-auto md:mx-0">
                            Thương hiệu không định hình từ những gì 365 Energy có, mà từ những rào cản khách hàng C-Level đang cần tháo gỡ. Mọi dữ liệu năng lực của chúng ta đều là "bảo chứng" để giải quyết nỗi đau của họ.
                        </p>
                    </header>

                    <!-- The Logic Chain: Market -> Customer -> Us -->
                    <div class="grid md:grid-cols-3 gap-6 mb-14 animate-stagger">
                        <!-- Market -->
                        <div class="card-premium p-7 logic-connector md:after:hidden">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">1. Sự thật thị trường</h3>
                                <div class="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center"><i data-lucide="bar-chart-3" class="w-4 h-4"></i></div>
                            </div>
                            <p class="text-base font-bold text-slate-900 mb-2">Sự Bão Hòa Của Mô Hình EPC Truyền Thống</p>
                            <p class="text-sm text-slate-600 leading-relaxed">Khi cơ chế giá FiT khép lại, theo IEEFA, thị trường từ chối việc "mua bán thiết bị đơn thuần". Việc cạnh tranh bằng giá thi công đang siết chặt biên lợi nhuận của toàn ngành.</p>
                        </div>
                        
                        <!-- Customer -->
                        <div class="card-premium p-7 logic-connector md:after:hidden">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">2. Nỗi đau khách hàng</h3>
                                <div class="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center"><i data-lucide="target" class="w-4 h-4"></i></div>
                            </div>
                            <p class="text-base font-bold text-slate-900 mb-2">Áp Lực Kép: Dòng Tiền & Tuân Thủ ESG</p>
                            <p class="text-sm text-slate-600 leading-relaxed">Khách hàng C-Level phải giải bài toán tối ưu OPEX (chi phí điện) và đối mặt với rào cản pháp lý mới (DPPA, CBAM, kiểm kê CO2) mà không muốn tự bỏ vốn đầu tư (Capex).</p>
                        </div>
                        
                        <!-- Us -->
                        <div class="card-premium p-7 customer-centric-border bg-emerald-50/30">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest">3. Năng lực giải quyết (365E)</h3>
                                <div class="w-8 h-8 brand-gradient text-white rounded-lg flex items-center justify-center"><i data-lucide="shield-check" class="w-4 h-4"></i></div>
                            </div>
                            <p class="text-base font-bold text-slate-900 mb-2">Bảo Chứng Năng Lực Vững Chắc</p>
                            <p class="text-sm text-slate-600 leading-relaxed">Hình thành từ 2016, quản lý hơn <strong>150 dự án C&I (200MWp)</strong>, doanh thu 25M USD (2020). Sở hữu khả năng tài trợ vốn và năng lực thiết kế đạt chuẩn PCCC khắt khe (FM Global, TCVN 3890).</p>
                        </div>
                    </div>

                    <!-- Audience Matrix (Direct Linkage) -->
                    <h3 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <i data-lucide="users" class="text-emerald-600 w-5 h-5"></i>
                        Ma Trận Giải Pháp Cho Từng Phân Khúc (Target Audience)
                    </h3>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <!-- TA 1: FDI -->
                        <div class="card-premium p-8 bg-white hover:border-emerald-300">
                            <span class="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded mb-4 inline-block">Tập đoàn Đa quốc gia (FDI)</span>
                            <h4 class="text-lg font-bold text-slate-900 mb-2">Chuỗi Cung Ứng Toàn Cầu</h4>
                            <p class="text-sm text-slate-600 mb-5 leading-relaxed"><strong>Nỗi đau:</strong> Bị áp đặt cam kết RE100. Sợ nhất rủi ro cháy nổ làm đình trệ sản xuất chuỗi cung ứng.</p>
                            
                            <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <p class="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-1">Giải pháp từ 365 Energy:</p>
                                <p class="text-sm text-slate-800 font-medium mb-3">Mô hình Zero-Capex (PPA), cung cấp I-REC (qua 365 Exergy) & Cam kết thi công đạt chuẩn FM Global.</p>
                                <div class="pt-3 border-t border-slate-200">
                                    <p class="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-500"></i>
                                        <strong>Bảo chứng thực tế:</strong> Schindler, Dunlopillo, BAT.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- TA 2: Local -->
                        <div class="card-premium p-8 bg-white hover:border-emerald-300">
                            <span class="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded mb-4 inline-block">Công nghiệp Nội địa Lớn</span>
                            <h4 class="text-lg font-bold text-slate-900 mb-2">Nhà Máy Sản Xuất Nặng</h4>
                            <p class="text-sm text-slate-600 mb-5 leading-relaxed"><strong>Nỗi đau:</strong> Hóa đơn tiền điện (OPEX) bào mòn lợi nhuận. Thiếu dòng vốn để tự đầu tư hệ thống.</p>
                            
                            <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <p class="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-1">Giải pháp từ 365 Energy:</p>
                                <p class="text-sm text-slate-800 font-medium mb-3">Tư vấn cấu trúc hợp đồng DPPA, triển khai PPA và tích hợp Lưu trữ điện (BESS) cắt đỉnh giờ cao điểm.</p>
                                <div class="pt-3 border-t border-slate-200">
                                    <p class="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-500"></i>
                                        <strong>Bảo chứng thực tế:</strong> Vina One Steel, SC Vivo City, Asia Cold Storage.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- TAB 2: BẢN ĐỒ CẠNH TRANH -->
                <section id="competitors" class="tab-content">
                    <header class="mb-14 text-center md:text-left">
                        <div class="section-tag bg-blue-50 text-blue-700 inline-flex">
                            <i data-lucide="crosshair" class="w-3.5 h-3.5"></i>
                            Khoảng Trống Thị Trường
                        </div>
                        <h2 class="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">Cạnh Tranh Phi Đối Xứng:<br/>Đánh Vào Điểm Yếu Cốt Lõi</h2>
                        <p class="text-base text-slate-600 max-w-3xl leading-relaxed mx-auto md:mx-0">
                            Không so sánh về giá. Bằng cách phân tích DNA tiến hóa của đối thủ, 365 Energy sẽ đánh trực diện vào những <strong>"Nhu cầu chưa được thỏa mãn" (Unmet needs)</strong> của khách hàng mà các tay chơi khác đang bỏ ngỏ.
                        </p>
                    </header>

                    <div class="space-y-6 animate-stagger">
                        
                        <!-- Competitor 1: Vu Phong -->
                        <div class="card-premium flex flex-col md:flex-row overflow-hidden customer-centric-border">
                            <div class="md:w-5/12 bg-slate-50/80 p-8 md:border-r border-slate-200">
                                <div class="flex justify-between items-start mb-3">
                                    <h3 class="text-2xl font-bold text-slate-900">Vũ Phong Energy</h3>
                                    <span class="px-2 py-1 bg-slate-200 text-slate-600 text-[9px] font-extrabold rounded uppercase tracking-widest">Top Tier Nội Địa</span>
                                </div>
                                <p class="text-sm text-slate-600 leading-relaxed mb-4">Mở rộng đa ngành (Điện mặt trời, Điện gió, R&D Robot, Asset-Co). Hệ sinh thái lớn nhưng dàn trải.</p>
                                <div class="flex flex-wrap gap-1.5">
                                    <span class="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">PPA</span>
                                    <span class="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">EPC</span>
                                    <span class="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">Robotics</span>
                                </div>
                            </div>
                            <div class="md:w-7/12 p-8 flex flex-col justify-center bg-white">
                                <p class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Khách hàng cần gì?</p>
                                <p class="text-sm text-slate-800 font-semibold mb-4">Sự linh hoạt, ra quyết định tài chính nhanh gọn, không vướng quy trình tập đoàn cồng kềnh.</p>
                                
                                <div class="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                                    <p class="font-bold text-emerald-800 text-xs mb-1.5 flex items-center gap-1.5"><i data-lucide="target" class="w-3.5 h-3.5"></i> Đối sách của 365E:</p>
                                    <p class="text-sm text-slate-700">Định vị là <strong>"Boutique EaaS Firm" (Tổ chức tinh hoa)</strong>: Focus 100% vào năng lượng C&I. "May đo" cấu trúc dòng tiền PPA linh hoạt theo từng nhà máy với tốc độ thẩm định cực nhanh.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Competitor 2: Solarvest -->
                        <div class="card-premium flex flex-col md:flex-row overflow-hidden customer-centric-border">
                            <div class="md:w-5/12 bg-slate-50/80 p-8 md:border-r border-slate-200">
                                <div class="flex justify-between items-start mb-3">
                                    <h3 class="text-2xl font-bold text-slate-900">Solarvest Holdings</h3>
                                    <span class="px-2 py-1 bg-slate-200 text-slate-600 text-[9px] font-extrabold rounded uppercase tracking-widest">Kỳ Lân APAC</span>
                                </div>
                                <p class="text-sm text-slate-600 leading-relaxed mb-4">Tập đoàn niêm yết Malaysia, năng lực 3.2GWp tại 8 quốc gia. Rất mạnh về FinTech và AIoT.</p>
                                <div class="flex flex-wrap gap-1.5">
                                    <span class="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">LSS/C&I</span>
                                    <span class="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">Fintech</span>
                                    <span class="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">RECs</span>
                                </div>
                            </div>
                            <div class="md:w-7/12 p-8 flex flex-col justify-center bg-white">
                                <p class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Khách hàng (FDI) lo sợ điều gì?</p>
                                <p class="text-sm text-slate-800 font-semibold mb-4">Rủi ro chậm tiến độ do đối tác ngoại không am hiểu sâu sắc rào cản pháp lý & PCCC tại Việt Nam.</p>
                                
                                <div class="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                                    <p class="font-bold text-emerald-800 text-xs mb-1.5 flex items-center gap-1.5"><i data-lucide="target" class="w-3.5 h-3.5"></i> Đối sách của 365E:</p>
                                    <p class="text-sm text-slate-700">Dùng <strong>Năng Lực Bản Địa (Local Know-how)</strong> làm mộc khiên. Cam kết bao tiêu mượt mà thủ tục PCCC (TCVN 3890), thẩm định FM Global và tư vấn luật DPPA thông suốt.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Competitor 3: SolarBK -->
                        <div class="card-premium flex flex-col md:flex-row overflow-hidden customer-centric-border">
                            <div class="md:w-5/12 bg-slate-50/80 p-8 md:border-r border-slate-200">
                                <div class="flex justify-between items-start mb-3">
                                    <h3 class="text-2xl font-bold text-slate-900">SolarBK</h3>
                                    <span class="px-2 py-1 bg-slate-200 text-slate-600 text-[9px] font-extrabold rounded uppercase tracking-widest">Sản Xuất Nội Bộ</span>
                                </div>
                                <p class="text-sm text-slate-600 leading-relaxed mb-4">Đi lên từ R&D, tập trung tự chủ phần cứng với nhà máy sản xuất tấm pin (IREX) và nền tảng IoT (SSOC).</p>
                            </div>
                            <div class="md:w-7/12 p-8 flex flex-col justify-center bg-white">
                                <p class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Khách hàng cần gì?</p>
                                <p class="text-sm text-slate-800 font-semibold mb-4">Giải pháp tối ưu hóa hiệu suất nhất, không muốn bị ép dùng vật tư "cây nhà lá vườn".</p>
                                
                                <div class="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                                    <p class="font-bold text-emerald-800 text-xs mb-1.5 flex items-center gap-1.5"><i data-lucide="target" class="w-3.5 h-3.5"></i> Đối sách của 365E:</p>
                                    <p class="text-sm text-slate-700">Định vị <strong>"Độc lập nền tảng" (Vendor-Neutral)</strong>. Tự do chọn lựa vật tư Tier-1 (Longi, SMA...) để cấu hình hệ thống đạt sản lượng cao nhất cho bài toán riêng của từng chủ đầu tư.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Combined Competitors (Funds & Trading) -->
                        <div class="grid md:grid-cols-2 gap-6">
                            <!-- CME / BayWa -->
                            <div class="card-premium p-8 bg-white customer-centric-border flex flex-col">
                                <span class="w-max px-2.5 py-1 bg-slate-100 text-slate-700 text-[9px] font-extrabold rounded uppercase tracking-widest mb-3">Định chế tài chính ngoại</span>
                                <h3 class="text-xl font-bold text-slate-900 mb-2">CME Solar / BayWa r.e.</h3>
                                <p class="text-sm text-slate-600 mb-4">Mạnh về vốn M&A nhưng thiếu đội ngũ thi công nội địa, phụ thuộc nhà thầu phụ (Outsource EPC).</p>
                                <div class="mt-auto border-t border-slate-100 pt-4">
                                    <p class="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">Nỗi lo của khách hàng:</p>
                                    <p class="text-sm text-slate-800 font-medium mb-3">Bị "bỏ con giữa chợ" khi hệ thống cần bảo trì (O&M).</p>
                                    <p class="text-sm text-emerald-700 font-semibold">365E chốt bằng: Bảo chứng kép (Vốn mạnh + In-house EPC quản trị 20 năm).</p>
                                </div>
                            </div>

                            <!-- Long Tech / Tona -->
                            <div class="card-premium p-8 bg-white customer-centric-border flex flex-col">
                                <span class="w-max px-2.5 py-1 bg-slate-100 text-slate-700 text-[9px] font-extrabold rounded uppercase tracking-widest mb-3">Trading & Boutique EPC</span>
                                <h3 class="text-xl font-bold text-slate-900 mb-2">Long Tech / Tona Syntegra</h3>
                                <p class="text-sm text-slate-600 mb-4">Thế mạnh cung cấp vật tư/kỹ thuật. Tư duy đàm phán "bán thiết bị" vẫn lấn át.</p>
                                <div class="mt-auto border-t border-slate-100 pt-4">
                                    <p class="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">Nỗi lo của khách hàng:</p>
                                    <p class="text-sm text-slate-800 font-medium mb-3">Bị sa đà vào ma trận so sánh thông số kỹ thuật, giá linh kiện.</p>
                                    <p class="text-sm text-emerald-700 font-semibold">365E chốt bằng: Đàm phán trực tiếp với CFO về cam kết OPEX và tín chỉ CO2.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <!-- TAB 3: ĐỊNH VỊ THƯƠNG HIỆU -->
                <section id="positioning" class="tab-content">
                    <header class="mb-14 text-center md:text-left">
                        <div class="section-tag bg-amber-50 text-amber-700 inline-flex">
                            <i data-lucide="git-merge" class="w-3.5 h-3.5"></i>
                            Chiến Lược Định Vị Lõi
                        </div>
                        <h2 class="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">3 Kịch Bản Chiến Lược<br/>Định Vị Tương Lai 2026</h2>
                        <p class="text-base text-slate-600 max-w-3xl leading-relaxed mx-auto md:mx-0">
                            Các kịch bản được phát triển từ Tầm nhìn của 365E, nhắm thẳng vào các "điểm neo" (anchor points) trong tâm trí của từng nhóm khách hàng mục tiêu để HĐQT biểu quyết định hướng.
                        </p>
                    </header>

                    <div class="grid md:grid-cols-3 gap-6 animate-stagger items-stretch">
                        
                        <!-- Option 1 (Recommended) -->
                        <div class="card-premium rounded-3xl p-8 relative flex flex-col h-full border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 md:-translate-y-4 bg-white">
                            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 brand-gradient text-white px-4 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-widest shadow-md whitespace-nowrap">
                                Lựa Chọn Tối Ưu
                            </div>
                            
                            <div class="text-center mb-6 mt-4">
                                <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                    <i data-lucide="layers" class="w-8 h-8 text-emerald-600"></i>
                                </div>
                                <h3 class="text-2xl font-extrabold text-slate-900 mb-1">The EaaS Integrator</h3>
                                <p class="text-[11px] text-emerald-600 font-bold uppercase tracking-widest">Nhà Tích Hợp Toàn Diện</p>
                            </div>
                            
                            <div class="flex-1 flex flex-col">
                                <p class="text-sm text-slate-600 mb-5 text-center leading-relaxed">Tích hợp hoàn hảo năng lực tài trợ vốn (PPA), năng lực In-house EPC (150MWp) và dịch vụ ESG. Định vị 365E là "Một điểm đến".</p>
                                
                                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-center">
                                    <p class="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-1.5">Tuyên Ngôn Thương Hiệu</p>
                                    <p class="text-sm text-slate-800 font-semibold italic">"Chuyển đổi năng lượng không rủi ro, chịu trách nhiệm xuyên suốt từ thiết kế, nguồn vốn đến vận hành."</p>
                                </div>
                                
                                <ul class="text-sm text-slate-600 space-y-3 mt-auto">
                                    <li class="flex items-start gap-2.5">
                                        <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"></i> 
                                        <span><strong>Đáp ứng KH:</strong> Bao quát toàn bộ tệp FDI và Nội địa.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Option 2 -->
                        <div class="card-premium rounded-3xl p-8 relative flex flex-col h-full bg-white hover:border-slate-300">
                            <div class="text-center mb-6 mt-4">
                                <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                    <i data-lucide="leaf" class="w-8 h-8 text-blue-600"></i>
                                </div>
                                <h3 class="text-2xl font-extrabold text-slate-900 mb-1">Net-Zero Catalyst</h3>
                                <p class="text-[11px] text-blue-600 font-bold uppercase tracking-widest">Đối Tác ESG Chiến Lược</p>
                            </div>
                            
                            <div class="flex-1 flex flex-col">
                                <p class="text-sm text-slate-600 mb-5 text-center leading-relaxed">Đưa thương hiệu <strong>365 Exergy</strong> lên tuyến đầu. Xây dựng hình ảnh Cố vấn Môi trường cao cấp, thi công chỉ là công cụ đi kèm.</p>
                                
                                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-center">
                                    <p class="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-1.5">Tuyên Ngôn Thương Hiệu</p>
                                    <p class="text-sm text-slate-800 font-semibold italic">"Cấp 'Giấy thông hành Xanh' giúp doanh nghiệp giữ vững vị thế trong chuỗi cung ứng toàn cầu."</p>
                                </div>
                                
                                <ul class="text-sm text-slate-600 space-y-3 mt-auto">
                                    <li class="flex items-start gap-2.5">
                                        <i data-lucide="check-circle-2" class="w-4 h-4 text-blue-500 mt-0.5 shrink-0"></i> 
                                        <span><strong>Đáp ứng KH:</strong> Đánh trúng nỗi đau tuân thủ CBAM/RE100 của khối FDI.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Option 3 -->
                        <div class="card-premium rounded-3xl p-8 relative flex flex-col h-full bg-white hover:border-slate-300">
                            <div class="text-center mb-6 mt-4">
                                <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
                                    <i data-lucide="pie-chart" class="w-8 h-8 text-amber-600"></i>
                                </div>
                                <h3 class="text-2xl font-extrabold text-slate-900 mb-1">Green Fin-Architect</h3>
                                <p class="text-[11px] text-amber-600 font-bold uppercase tracking-widest">Kiến Tạo Tài Chính Xanh</p>
                            </div>
                            
                            <div class="flex-1 flex flex-col">
                                <p class="text-sm text-slate-600 mb-5 text-center leading-relaxed">Giao tiếp 100% bằng ngôn ngữ tài chính. Định vị 365E như một "Ngân hàng" tài trợ cơ sở hạ tầng (ESCO) cho nhà máy.</p>
                                
                                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-center">
                                    <p class="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-1.5">Tuyên Ngôn Thương Hiệu</p>
                                    <p class="text-sm text-slate-800 font-semibold italic">"Zero-Capex. Chuyển hóa không gian mái nhàn rỗi thành lợi nhuận OPEX tức thì."</p>
                                </div>
                                
                                <ul class="text-sm text-slate-600 space-y-3 mt-auto">
                                    <li class="flex items-start gap-2.5">
                                        <i data-lucide="check-circle-2" class="w-4 h-4 text-amber-500 mt-0.5 shrink-0"></i> 
                                        <span><strong>Đáp ứng KH:</strong> Thuyết phục trực diện CFO nội địa đang khát vốn, cần cắt giảm chi phí.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- TAB 4: KIẾN TRÚC HSNL (CHI TIẾT MÔ HÌNH A) -->
                <section id="profile" class="tab-content">
                    <header class="mb-14 text-center md:text-left">
                        <div class="section-tag bg-purple-50 text-purple-700 inline-flex">
                            <i data-lucide="layout-template" class="w-3.5 h-3.5"></i>
                            Phần 04: Bản Thuyết Trình C-Level (Pitch Deck)
                        </div>
                        <h2 class="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">Kiến Trúc Hồ Sơ Năng Lực 2026:<br/>Mô Hình Tích Hợp EaaS Toàn Diện</h2>
                        <p class="text-base text-slate-600 max-w-3xl leading-relaxed mx-auto md:mx-0">
                            Hồ sơ năng lực 2026 của 365 Energy được tái thiết kế thành một <strong>Bản Đề Xuất Giải Pháp (Solution Pitch Deck)</strong> sắc bén. Bỏ qua cách kể lể lịch sử nhàm chán, cấu trúc này dẫn dắt tâm lý đối tác đi qua 4 phân lớp giá trị cốt lõi.
                        </p>
                    </header>

                    <!-- Blueprint Timeline Layout -->
                    <div class="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-300 before:to-transparent space-y-12">
                        
                        <!-- Section 1: The Context -->
                        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-stagger">
                            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-emerald-500 text-emerald-600 shadow-xl absolute left-0 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 z-10 font-black">
                                1
                            </div>
                            <div class="card-premium bg-white p-8 w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] hover:border-emerald-400">
                                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded uppercase tracking-widest mb-3 inline-block">Trang 01 - 04</span>
                                <h3 class="text-2xl font-bold text-slate-900 mb-2">Thấu Hiểu Bối Cảnh (The Context)</h3>
                                <p class="text-sm text-slate-600 mb-5 leading-relaxed">Thay thế Thư Ngỏ truyền thống bằng Tuyên ngôn của CEO về áp lực vĩ mô mà chính khách hàng đang phải gánh chịu.</p>
                                
                                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p class="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-2">Mục tiêu C-Level:</p>
                                    <p class="text-sm text-slate-700 font-medium mb-3">Tạo sự đồng cảm. Chứng minh 365E thấu hiểu luật chơi DPPA, sức ép OPEX và yêu cầu chứng chỉ xanh (CBAM).</p>
                                    <div class="pt-3 border-t border-slate-200">
                                        <p class="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                                            <i data-lucide="pen-tool" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"></i>
                                            <span><strong>Gợi ý Copywriting:</strong> "Quý vị đang đứng trước áp lực chuyển dịch kép... 365 Energy ở đây không để bán thiết bị, chúng tôi gánh vác rủi ro đầu tư và chia sẻ lợi nhuận dòng tiền cùng quý vị."</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: The Core Ecosystem -->
                        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-stagger">
                            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-emerald-500 text-emerald-600 shadow-xl absolute left-0 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 z-10 font-black">
                                2
                            </div>
                            <div class="card-premium bg-white p-8 w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] hover:border-emerald-400">
                                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded uppercase tracking-widest mb-3 inline-block">Trang 05 - 10</span>
                                <h3 class="text-2xl font-bold text-slate-900 mb-2">Hệ Sinh Thái Giải Pháp (EaaS Core)</h3>
                                <p class="text-sm text-slate-600 mb-5 leading-relaxed">Trình bày cấu trúc "One-Stop Solution" dưới dạng vòng tuần hoàn khép kín, xóa bỏ sự phân mảnh trong khâu vận hành của nhà máy.</p>
                                
                                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p class="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-2">Cách thức triển khai:</p>
                                    <ul class="text-sm text-slate-700 space-y-2 mb-3">
                                        <li><strong>Tài trợ vốn:</strong> Mô hình PPA/ESCO (Zero-Capex).</li>
                                        <li><strong>Thực thi EPC:</strong> Năng lực tư vấn thiết kế & xây lắp.</li>
                                        <li><strong>Gia tăng giá trị:</strong> Cung cấp I-REC & Giải pháp BESS.</li>
                                    </ul>
                                    <div class="pt-3 border-t border-slate-200">
                                        <p class="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                                            <i data-lucide="pen-tool" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"></i>
                                            <span><strong>Gợi ý Copywriting:</strong> "Một điểm chạm duy nhất cho mọi nhu cầu. Chúng tôi cung cấp nguồn vốn, kiến tạo hạ tầng và đảm bảo hiệu suất năng lượng 20 năm liên tục."</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 3: The Trust Credentials -->
                        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-stagger">
                            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-emerald-500 text-emerald-600 shadow-xl absolute left-0 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 z-10 font-black">
                                3
                            </div>
                            <div class="card-premium bg-white p-8 w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] hover:border-emerald-400">
                                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded uppercase tracking-widest mb-3 inline-block">Trang 11 - 16</span>
                                <h3 class="text-2xl font-bold text-slate-900 mb-2">Bảo Chứng Năng Lực (Trust Credentials)</h3>
                                <p class="text-sm text-slate-600 mb-5 leading-relaxed">Đập tan nỗi lo của CFO và Giám đốc kỹ thuật bằng Data cứng. Không dùng từ ngữ cảm tính.</p>
                                
                                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p class="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-2">Dữ liệu chứng minh (Facts):</p>
                                    <ul class="text-sm text-slate-700 space-y-2 mb-3">
                                        <li><strong>An toàn:</strong> Tuân thủ tuyệt đối FM Global, TCVN 3890 (PCCC), NEC. Loại bỏ nỗi sợ cháy nổ.</li>
                                        <li><strong>Quy mô:</strong> Hơn 150 dự án, 200MWp quản lý, 300MWp lắp đặt.</li>
                                        <li><strong>Tài chính:</strong> Doanh thu minh bạch 25M USD, minh chứng tiềm lực mạnh.</li>
                                    </ul>
                                    <div class="pt-3 border-t border-slate-200">
                                        <p class="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                                            <i data-lucide="pen-tool" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"></i>
                                            <span><strong>Gợi ý Copywriting:</strong> "Sự an toàn của cơ sở hạ tầng nhà máy là bất khả xâm phạm. Mọi thiết kế tại 365 Energy đều đi qua bộ lọc kiểm định khắt khe nhất của FM Global."</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 4: Success Stories -->
                        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-stagger">
                            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-emerald-500 text-emerald-600 shadow-xl absolute left-0 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 z-10 font-black">
                                4
                            </div>
                            <div class="card-premium bg-white p-8 w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] hover:border-emerald-400">
                                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded uppercase tracking-widest mb-3 inline-block">Trang 17 - 24+</span>
                                <h3 class="text-2xl font-bold text-slate-900 mb-2">Thực Chứng Tác Động (Impact Stories)</h3>
                                <p class="text-sm text-slate-600 mb-5 leading-relaxed">Tuyệt đối không liệt kê danh sách dự án khô khan. Trình bày dưới dạng Case Study (Nghiên cứu tình huống) giải quyết vấn đề.</p>
                                
                                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p class="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-2">Kịch bản Case Study:</p>
                                    <ul class="text-sm text-slate-700 space-y-2 mb-3">
                                        <li><strong>Case Vina One (Ngành công nghiệp nặng):</strong> Giải bài toán tối ưu OPEX và giảm tải hệ thống.</li>
                                        <li><strong>Case SC Vivo City (Thương mại):</strong> Thi công trên địa hình phức tạp, đòi hỏi thẩm mỹ & an toàn cao.</li>
                                        <li><strong>Case Schindler / BAT (FDI):</strong> Chứng minh năng lực cấp vốn PPA và tiêu chuẩn quốc tế.</li>
                                    </ul>
                                    <div class="pt-3 border-t border-slate-200">
                                        <p class="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                                            <i data-lucide="pen-tool" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"></i>
                                            <span><strong>Gợi ý Copywriting:</strong> [Tên Dự án] - Từ bài toán ngân sách đến hệ thống phát điện [X] MWp, tiết kiệm [Y] tỷ VNĐ/năm và cắt giảm [Z] tấn Carbon.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    </main>
</div>

<script>
    // Handle main tab switching
    function switchTab(tabId) {
        // Reset all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-emerald-500/20', 'text-emerald-50', 'border-emerald-500/30');
            btn.classList.add('text-emerald-100/70', 'hover:bg-emerald-500/10', 'hover:text-emerald-50', 'border-transparent');
        });

        // Activate clicked button
        const activeBtn = document.querySelector(`[data-target="${tabId}"]`);
        if(activeBtn) {
            activeBtn.classList.remove('text-emerald-100/70', 'hover:bg-emerald-500/10', 'hover:text-emerald-50', 'border-transparent');
            activeBtn.classList.add('bg-emerald-500/20', 'text-emerald-50', 'border-emerald-500/30');
        }

        // Handle Content Transitions
        const contents = document.querySelectorAll('.tab-content');
        
        contents.forEach(content => {
            if (content.classList.contains('active') && content.id !== tabId) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(15px)';
                setTimeout(() => {
                    content.classList.remove('active');
                    content.style.display = 'none';
                }, 300); 
            }
        });

        setTimeout(() => {
            const targetContent = document.getElementById(tabId);
            if(targetContent && !targetContent.classList.contains('active')) {
                targetContent.style.display = 'block';
                requestAnimationFrame(() => {
                    targetContent.classList.add('active');
                    targetContent.style.opacity = '1';
                    targetContent.style.transform = 'translateY(0)';
                });
            }
        }, 300);
    }

    // Initialize Lucide Icons
    lucide.createIcons();
</script>

</body>
</html>