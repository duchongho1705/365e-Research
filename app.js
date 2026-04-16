const { useState, useEffect, useRef } = React;

        // --- FIREBASE INITIALIZATION ---
        const firebaseConfig = {
            apiKey: "AIzaSyC50RFdSHxUysTLe7Ehphl64vDD-CWcbFM",
            authDomain: "e-research-909b5.firebaseapp.com",
            databaseURL: "https://e-research-909b5-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "e-research-909b5",
            storageBucket: "e-research-909b5.firebasestorage.app",
            messagingSenderId: "1067733736920",
            appId: "1:1067733736920:web:42352520dacaa42583a6ad"
        };
        
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const db = firebase.database();

        // --- EDITABLE COMPONENT ---
        const EditableText = ({ id, defaultText, isEditMode, tagName = "p", className = "" }) => {
            const [text, setText] = useState(defaultText);
            const textRef = useRef(defaultText);
            const elRef = useRef(null);
            
            useEffect(() => {
                const ref = db.ref('content/' + id);
                const listener = ref.on('value', (snapshot) => {
                    if (snapshot.exists()) {
                        const val = snapshot.val();
                        setText(val);
                        textRef.current = val;
                        if (elRef.current && elRef.current !== document.activeElement) {
                            elRef.current.innerText = val;
                        }
                    }
                });
                return () => ref.off('value', listener);
            }, [id]);

            const handleInput = (e) => {
                textRef.current = e.target.innerText;
            };

            const handleBlur = (e) => {
                const newText = textRef.current;
                db.ref('content/' + id).set(newText);
            };

            const Tag = tagName;
            
            return (
                <Tag 
                    ref={elRef}
                    className={`${className} ${isEditMode ? 'border border-dashed border-emerald-400 p-1 rounded bg-emerald-50/50 cursor-text min-h-[1em] outline-none transition-colors' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onInput={handleInput}
                    onBlur={handleBlur}
                >
                    {text}
                </Tag>
            );
        };

        // --- FEEDBACK COMPONENT ---
        const FeedbackSection = ({ tabId }) => {
            const [comments, setComments] = useState([]);
            const [name, setName] = useState('');
            const [content, setContent] = useState('');
            
            useEffect(() => {
                const commentsRef = db.ref('feedbacks/' + tabId);
                const listener = commentsRef.on('value', (snapshot) => {
                    const data = snapshot.val();
                    const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
                    // Sort descending by timestamp
                    list.sort((a, b) => b.timestamp - a.timestamp);
                    setComments(list);
                });
                return () => commentsRef.off('value', listener);
            }, [tabId]);

            const handleSubmit = (e) => {
                e.preventDefault();
                if (!name.trim() || !content.trim()) return;
                
                db.ref('feedbacks/' + tabId).push({
                    name: name.trim(),
                    content: content.trim(),
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                setContent('');
            };

            return (
                <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <i data-lucide="users" className="w-3.5 h-3.5 text-emerald-600"></i>
                            </span>
                            Góp ý & Thảo luận ({comments.length})
                        </h4>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar scroll-smooth">
                            {comments.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">Chưa có góp ý nào. Hãy là người đầu tiên đưa ra quan điểm!</p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 uppercase font-bold">
                                                    {comment.name.substring(0, 2)}
                                                </div>
                                                {comment.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                                                {new Date(comment.timestamp || Date.now()).toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 whitespace-pre-wrap pl-8">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="border-t border-slate-200 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Tên của bạn..." 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="md:col-span-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-800"
                                    required 
                                />
                                <div className="md:col-span-3 flex flex-col sm:flex-row gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="Nhập quan điểm của bạn về chiến lược này..." 
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-800"
                                        required 
                                    />
                                    <button type="submit" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                                        <i data-lucide="send" className="w-4 h-4 mr-2"></i> Gửi Đi
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            );
        };

        // --- CẤU HÌNH HỆ THỐNG ICON AN TOÀN ---
        // Thiết lập cơ chế render độc lập để loại bỏ lỗi toSvg của thư viện Lucide 
        // và ngăn chặn xung đột AST với Tailwind CSS.
        const BaseIcon = ({ name, className = '', size = 24, color = 'currentColor', strokeWidth = 2, fill = 'none' }) => {
            const elRef = useRef(null);

            useEffect(() => {
                const renderIcon = () => {
                    if (elRef.current && window.lucide) {
                        const kebabName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
                        elRef.current.innerHTML = `<i data-lucide="${kebabName}"></i>`;
                        window.lucide.createIcons({
                            root: elRef.current,
                            nameAttr: 'data-lucide',
                            attrs: {
                                class: className,
                                stroke: color,
                                'stroke-width': strokeWidth,
                                fill: fill,
                                width: size,
                                height: size
                            }
                        });
                    }
                };

                renderIcon();
                // Đảm bảo icon luôn được render kể cả khi tải thư viện chậm
                const timeoutId = setTimeout(renderIcon, 500);
                return () => clearTimeout(timeoutId);
            }, [name, className, size, color, strokeWidth, fill]);

            return <span ref={elRef} className="inline-flex items-center justify-center shrink-0" />;
        };

        // Khởi tạo các Component Icon riêng biệt
        const Sun = (props) => <BaseIcon name="Sun" {...props} />;
        const Wind = (props) => <BaseIcon name="Wind" {...props} />;
        const Droplets = (props) => <BaseIcon name="Droplets" {...props} />;
        const Leaf = (props) => <BaseIcon name="Leaf" {...props} />;
        const Flame = (props) => <BaseIcon name="Flame" {...props} />;
        const Zap = (props) => <BaseIcon name="Zap" {...props} />;
        const BookOpen = (props) => <BaseIcon name="BookOpen" {...props} />;
        const Briefcase = (props) => <BaseIcon name="Briefcase" {...props} />;
        const Battery = (props) => <BaseIcon name="Battery" {...props} />;
        const Cpu = (props) => <BaseIcon name="Cpu" {...props} />;
        const Activity = (props) => <BaseIcon name="Activity" {...props} />;
        const ChevronRight = (props) => <BaseIcon name="ChevronRight" {...props} />;
        const ArrowRight = (props) => <BaseIcon name="ArrowRight" {...props} />;
        const Building = (props) => <BaseIcon name="Building" {...props} />;
        const Target = (props) => <BaseIcon name="Target" {...props} />;
        const ShieldCheck = (props) => <BaseIcon name="ShieldCheck" {...props} />;
        const DollarSign = (props) => <BaseIcon name="DollarSign" {...props} />;
        const Globe = (props) => <BaseIcon name="Globe" {...props} />;
        const Award = (props) => <BaseIcon name="Award" {...props} />;
        const BarChart = (props) => <BaseIcon name="BarChart" {...props} />;
        const FileText = (props) => <BaseIcon name="FileText" {...props} />;
        const Trophy = (props) => <BaseIcon name="Trophy" {...props} />;
        const Star = (props) => <BaseIcon name="Star" {...props} />;
        const AlertTriangle = (props) => <BaseIcon name="AlertTriangle" {...props} />;
        const Rocket = (props) => <BaseIcon name="Rocket" {...props} />;
        const PieChart = (props) => <BaseIcon name="PieChart" {...props} />;
        const Layers = (props) => <BaseIcon name="Layers" {...props} />;
        const BookMarked = (props) => <BaseIcon name="BookMarked" {...props} />;
        const CheckCircle = (props) => <BaseIcon name="CheckCircle" {...props} />;
        const ExternalLink = (props) => <BaseIcon name="ExternalLink" {...props} />;
        const Calendar = (props) => <BaseIcon name="Calendar" {...props} />;
        const MapPin = (props) => <BaseIcon name="MapPin" {...props} />;
        const Users = (props) => <BaseIcon name="Users" {...props} />;
        const Waves = (props) => <BaseIcon name="Waves" {...props} />;
        const Hexagon = (props) => <BaseIcon name="Hexagon" {...props} />;
        const BarChart3 = (props) => <BaseIcon name="BarChart3" {...props} />;
        const LineChart = (props) => <BaseIcon name="LineChart" {...props} />;
        const Shield = (props) => <BaseIcon name="Shield" {...props} />;
        const LayoutDashboard = (props) => <BaseIcon name="LayoutDashboard" {...props} />;
        const Settings = (props) => <BaseIcon name="Settings" {...props} />;
        const FileSearch = (props) => <BaseIcon name="FileSearch" {...props} />;
        const ClipboardCheck = (props) => <BaseIcon name="ClipboardCheck" {...props} />;
        const Network = (props) => <BaseIcon name="Network" {...props} />;
        const Scale = (props) => <BaseIcon name="Scale" {...props} />;
        const Lightbulb = (props) => <BaseIcon name="Lightbulb" {...props} />;
        const Puzzle = (props) => <BaseIcon name="Puzzle" {...props} />;
        const RefreshCw = (props) => <BaseIcon name="RefreshCw" {...props} />;
        const PhoneCall = (props) => <BaseIcon name="PhoneCall" {...props} />;
        const DownloadCloud = (props) => <BaseIcon name="DownloadCloud" {...props} />;

        // --- DATA: NGUỒN NĂNG LƯỢNG ---
        const ENERGY_TYPES = [
            {
                id: 'solar',
                name: 'Năng lượng Mặt trời (Solar PV)',
                icon: <Sun className="w-8 h-8 text-amber-500" />,
                color: 'bg-amber-50 border-amber-200',
                desc: 'Giải pháp chuyển đổi quang năng thành điện năng, tối ưu hóa không gian nhàn rỗi tại cơ sở thương mại và công nghiệp.',
                principle: 'Ứng dụng hiệu ứng quang điện (Photovoltaic) qua tế bào bán dẫn để tạo dòng điện một chiều (DC), sau đó chuyển thành dòng xoay chiều (AC) qua biến tần (Inverter).',
                tech: ['Pin đơn tinh thể (Mono-crystalline)', 'Biến tần chuỗi/trung tâm (String/Central Inverters)', 'Hệ thống theo dõi quỹ đạo (Tracking Systems)'],
                pros: ['Công nghệ trưởng thành, độ tin cậy cao', 'Chi phí quy dẫn (LCOE) liên tục tối ưu', 'Thời gian hoàn vốn (ROI) hấp dẫn'],
                cons: ['Sản lượng phụ thuộc bức xạ (tính gián đoạn)', 'Yêu cầu diện tích bề mặt lớn', 'Suy hao hiệu suất theo thời gian']
            },
            {
                id: 'wind',
                name: 'Năng lượng Gió (Wind Power)',
                icon: <Wind className="w-8 h-8 text-blue-500" />,
                color: 'bg-blue-50 border-blue-200',
                desc: 'Khai thác động năng từ các luồng không khí quy mô lớn để sản xuất điện năng thương mại.',
                principle: 'Khí động học tác động lên cánh quạt làm quay rotor, năng lượng cơ học được truyền qua hộp số đến máy phát điện.',
                tech: ['Tuabin trên bờ (Onshore)', 'Tuabin ngoài khơi (Offshore)', 'Hệ thống điều khiển góc bước (Pitch Control)'],
                pros: ['Hệ số công suất (Capacity Factor) cao tại vùng gió tối ưu', 'Tiết kiệm quỹ đất bề mặt', 'Đóng góp lớn vào lưới điện phụ tải nền'],
                cons: ['Chi phí đầu tư (CAPEX) và bảo trì (OPEX) cao', 'Tác động đến cảnh quan và hệ sinh thái', 'Yêu cầu hạ tầng truyền tải phức tạp']
            },
            {
                id: 'hydro',
                name: 'Thủy điện (Hydropower)',
                icon: <Droplets className="w-8 h-8 text-cyan-500" />,
                color: 'bg-cyan-50 border-cyan-200',
                desc: 'Khai thác thế năng và động năng của dòng nước, đóng vai trò điều tần và chạy nền cho lưới điện.',
                principle: 'Thế năng cột nước chuyển hóa thành động năng quay tuabin (Francis, Pelton, Kaplan), kích hoạt máy phát điện.',
                tech: ['Hồ chứa quy mô lớn (Reservoir)', 'Thủy điện tích năng (Pumped-storage)', 'Đập dâng (Run-of-the-river)'],
                pros: ['Cung cấp điện nền (Baseload) ổn định', 'Tích hợp chức năng chống ngập, thủy lợi', 'Tuổi thọ dự án dài (>50 năm)'],
                cons: ['Tác động sâu sắc đến hệ sinh thái và dòng chảy', 'Rủi ro suy giảm sản lượng do biến đổi khí hậu', 'Yêu cầu vốn và thời gian xây dựng khổng lồ']
            },
            {
                id: 'biomass',
                name: 'Sinh khối & Điện rác (Biomass/WTE)',
                icon: <Leaf className="w-8 h-8 text-emerald-500" />,
                color: 'bg-emerald-50 border-emerald-200',
                desc: 'Chuyển hóa vật liệu hữu cơ và rác thải thành điện năng hoặc nhiệt năng.',
                principle: 'Đốt trực tiếp, nhiệt phân hoặc khí hóa để tạo hơi nước áp suất cao làm quay tuabin.',
                tech: ['Điện rác (Waste-to-Energy)', 'Đồng phát nhiệt điện (CHP)', 'Khí hóa sinh khối'],
                pros: ['Giải quyết bài toán xử lý chất thải', 'Cung cấp năng lượng liên tục, có thể điều độ', 'Tận dụng phụ phẩm nông nghiệp'],
                cons: ['Kiểm soát phát thải khí thứ cấp phức tạp', 'Chuỗi cung ứng nguyên liệu thiếu ổn định', 'Hiệu suất chuyển đổi ở mức trung bình']
            },
            {
                id: 'bess',
                name: 'Lưu trữ Năng lượng (BESS)',
                icon: <Battery className="w-8 h-8 text-violet-500" />,
                color: 'bg-violet-50 border-violet-200',
                desc: 'Hệ thống thiết yếu giải quyết tính gián đoạn của năng lượng tái tạo và tối ưu hóa chi phí điện.',
                principle: 'Sử dụng công nghệ điện hóa (Lithium-ion) lưu trữ điện dư thừa và xả ra khi phụ tải yêu cầu.',
                tech: ['Pin Lithium Iron Phosphate (LFP)', 'Hệ thống Quản lý Pin (BMS)', 'Phần mềm Quản lý Năng lượng (EMS)'],
                pros: ['Dịch chuyển phụ tải (Peak Shaving) giảm tiền điện', 'Cung cấp nguồn dự phòng khẩn (UPS)', 'Ổn định tần số điện áp nội bộ'],
                cons: ['Chi phí đầu tư (CAPEX) còn tương đối cao', 'Suy hao dung lượng theo chu kỳ sạc/xả', 'Yêu cầu kiểm soát nhiệt và PCCC nghiêm ngặt']
            },
            {
                id: 'hydrogen',
                name: 'Hydro Xanh (Green Hydrogen)',
                icon: <Hexagon className="w-8 h-8 text-sky-500" />,
                color: 'bg-sky-50 border-sky-200',
                desc: 'Chất mang năng lượng tương lai, cốt lõi để khử carbon cho các ngành công nghiệp nặng.',
                principle: 'Điện phân nước (Electrolysis) bằng điện tái tạo, phân tách nước thành Hydro và Oxy không phát thải CO2.',
                tech: ['Máy điện phân PEM/Alkaline', 'Pin nhiên liệu (Fuel Cell)', 'Hạ tầng nén lưu trữ áp suất cao'],
                pros: ['Phát thải bằng 0 tại điểm sử dụng cuối', 'Nguyên liệu xanh cho luyện kim, hóa chất', 'Lưu trữ năng lượng xuyên mùa'],
                cons: ['Tổn thất hiệu suất trong vòng đời chuyển đổi', 'Chi phí sản xuất (LCOH) chưa cạnh tranh', 'Rào cản hạ tầng vận chuyển và an toàn']
            }
        ];

        // --- DATA: THUẬT NGỮ CHUYÊN NGÀNH ---
        const GLOSSARY_TERMS = [
            {
                category: 'Khung Tiêu chuẩn & Báo cáo Bền vững (ESG)',
                icon: <Leaf className="w-6 h-6 text-emerald-600" />,
                bgColor: 'bg-emerald-50',
                borderColor: 'border-emerald-200',
                textColor: 'text-emerald-800',
                items: [
                    { term: 'ESG (Environmental, Social, Governance)', def: 'Khung tiêu chuẩn đánh giá phát triển bền vững. Tiêu chí Môi trường (E) là điều kiện tiên quyết để tham gia chuỗi cung ứng toàn cầu.' },
                    { term: 'GHG Protocol', def: 'Tiêu chuẩn kế toán quốc tế phân loại lượng phát thải khí nhà kính thành 3 phạm vi (Scope 1, 2, 3).' },
                    { term: 'Scope 1 (Phát thải Trực tiếp)', def: 'Khí nhà kính từ tài sản do doanh nghiệp sở hữu hoặc kiểm soát (VD: Lò hơi, xe vận tải nội bộ).' },
                    { term: 'Scope 2 (Phát thải Gián tiếp - Năng lượng)', def: 'Phát thải từ sản xuất năng lượng mua ngoài (điện, làm mát). Điện mặt trời giúp triệt tiêu trực tiếp Scope 2.' },
                    { term: 'Scope 3 (Phát thải Chuỗi giá trị)', def: 'Phát thải liên đới từ chuỗi cung ứng (nhà thầu phụ, logistics). Lý do chính khiến khối FDI ép nhà máy gia công sử dụng năng lượng xanh.' },
                    { term: 'SBTi (Science Based Targets initiative)', def: 'Chuẩn mực yêu cầu doanh nghiệp thiết lập lộ trình giảm phát thải tương thích với mục tiêu giữ nhiệt độ toàn cầu không tăng quá 1.5°C.' },
                    { term: 'CSRD', def: 'Chỉ thị Báo cáo Bền vững của EU, buộc các doanh nghiệp công bố chi tiết số liệu tác động môi trường và xã hội.' },
                    { term: 'Greenwashing (Tẩy xanh)', def: 'Hành vi công bố sai lệch hoặc phóng đại nỗ lực bảo vệ môi trường. Các đợt kiểm toán ESG tập trung triệt tiêu rủi ro này.' }
                ]
            },
            {
                category: 'Thương mại Quốc tế & Tín chỉ Môi trường',
                icon: <Award className="w-6 h-6 text-blue-600" />,
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                textColor: 'text-blue-800',
                items: [
                    { term: 'CBAM (Cơ chế Điều chỉnh Biên giới Carbon)', def: 'Khung pháp lý của EU áp phí carbon lên hàng hóa nhập khẩu. Yêu cầu doanh nghiệp chứng minh lượng "carbon nhúng" thấp để bảo vệ biên lợi nhuận.' },
                    { term: 'I-REC (Tín chỉ Năng lượng Tái tạo)', def: 'Chứng nhận khả năng truy xuất nguồn gốc điện năng (1 I-REC = 1 MWh điện sạch). Công cụ hợp thức hóa báo cáo ESG mà không yêu cầu sở hữu tài sản phát điện.' },
                    { term: 'RE100', def: 'Sáng kiến toàn cầu yêu cầu các thành viên (Apple, Nike...) cam kết sử dụng 100% điện năng lượng tái tạo.' },
                    { term: 'Carbon Credit (Tín chỉ Carbon)', def: 'Giấy phép giao dịch cho phép phát thải 1 tấn CO2 tương đương. Phân biệt rõ với I-REC (chứng nhận sản xuất điện).' },
                    { term: 'VCM (Thị trường Carbon Tự nguyện)', def: 'Nơi doanh nghiệp mua bán tín chỉ carbon tự nguyện để bù đắp (offset) lượng khí thải nhà kính không thể tránh khỏi.' }
                ]
            },
            {
                category: 'Cấu trúc Đầu tư & Vận hành Dự án',
                icon: <BarChart3 className="w-6 h-6 text-amber-600" />,
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-200',
                textColor: 'text-amber-800',
                items: [
                    { term: 'ESCO / PPA', def: 'Cấu trúc tài chính ngoại bảng (Off-balance sheet) cho phép doanh nghiệp thụ hưởng năng lượng sạch không cần bỏ vốn đầu tư (CAPEX).' },
                    { term: 'DPPA (Mua bán Điện Trực tiếp)', def: 'Cơ chế cho phép khách hàng tiêu thụ lớn mua điện trực tiếp từ các đơn vị phát điện độc lập (IPP) qua lưới điện quốc gia.' },
                    { term: 'EPC', def: 'Mô hình thiết kế - mua sắm - thi công chìa khóa trao tay. Nhà thầu chịu trách nhiệm toàn diện đến khi bàn giao dự án.' },
                    { term: 'CAPEX / OPEX', def: 'Chi phí Đầu tư Ban đầu (CAPEX) / Chi phí Vận hành (OPEX). Mô hình PPA giúp doanh nghiệp chuyển đổi CAPEX thành OPEX.' },
                    { term: 'LCOE (Chi phí Quy dẫn Năng lượng)', def: 'Chi phí trung bình để sản xuất 1 kWh điện trong vòng đời dự án. Thước đo năng lực tối ưu thiết kế và thi công của nhà thầu.' },
                    { term: 'ROI & Payback Period', def: 'Tỷ suất hoàn vốn và Thời gian hoàn vốn. Chỉ số cốt lõi trong quyết định tự đầu tư hệ thống thay vì sử dụng ESCO.' }
                ]
            }
        ];

        // --- DATA: THƯƠNG HIỆU TOÀN CẦU ---
        const GLOBAL_BRANDS = [
            {
                name: 'ENGIE (Pháp / Toàn cầu)',
                website: 'https://www.engie.com',
                focus: 'Energy Transition as a Service (ETaaS)',
                profile: {
                    founded: '2008 (Tiền thân từ 1858)',
                    hq: 'Paris, Pháp',
                    scale: '~97.000 nhân sự toàn cầu.',
                    revenue: '~82.6 tỷ EUR (2023)',
                    key_markets: 'Châu Âu, Nam Mỹ, Bắc Mỹ, Châu Á - Thái Bình Dương'
                },
                stp: {
                    segmentation: 'Khách hàng phân khúc theo quy mô, mức thâm dụng carbon và cam kết ESG.',
                    targeting: 'Tập đoàn đa quốc gia (MNCs), đô thị thông minh, tổ hợp công nghiệp.',
                    positioning: 'Đối tác chiến lược dẫn dắt chuyển dịch năng lượng toàn cầu (Net Zero Champion).'
                },
                desc: 'Tập đoàn năng lượng hàng đầu thế giới, định vị cung cấp giải pháp chuyển đổi xanh trọn gói.',
                strengths: [
                    'Hệ sinh thái đa dạng: Điện mặt trời, điện gió, tối ưu hiệu năng số và trạm sạc EV.',
                    'Chiến lược "Net Zero as a Service" thiết lập lộ trình khử carbon đầu cuối.'
                ],
                weaknesses: [
                    'Chi phí quản trị dự án cao do quy mô bộ máy đa quốc gia.',
                    'Chu kỳ phê duyệt phức tạp ảnh hưởng tiến độ tại các thị trường mới nổi.'
                ],
                services: ['Tư vấn Lộ trình Net Zero', 'Tổng thầu EPC', 'Tài trợ vốn PPA', 'Lưu trữ BESS', 'Hydro Xanh & Sinh khối', 'Năng lượng Quận (District Energy)', 'Giao thông Xanh (EV Mobility)', 'Phần mềm Quản trị Năng lượng'],
                color: 'from-blue-500 to-cyan-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
            },
            {
                name: 'Enel Green Power (Ý / Toàn cầu)',
                website: 'https://www.enelgreenpower.com',
                focus: 'Corporate PPAs & Đa dạng nguồn phát',
                profile: {
                    founded: '2008',
                    hq: 'Rome, Ý',
                    scale: '>60 GW công suất NLTT trên 28 quốc gia',
                    revenue: '~95.5 tỷ EUR (Toàn tập đoàn - 2023)',
                    key_markets: 'Châu Âu, Bắc Mỹ, Mỹ Latinh, Châu Phi'
                },
                stp: {
                    segmentation: 'Đơn vị tiêu thụ điện quy mô lớn, cần khóa giá năng lượng dài hạn.',
                    targeting: 'Tập đoàn có nhu cầu ký kết Corporate PPA để phòng vệ rủi ro chi phí.',
                    positioning: 'Nhà sản xuất năng lượng tái tạo hàng đầu, bảo chứng về sự ổn định nguồn điện.'
                },
                desc: 'Nhà phát triển dự án năng lượng tái tạo, sở hữu danh mục đầu tư từ năng lượng mặt trời đến địa nhiệt và thủy điện.',
                strengths: [
                    'Năng lực tài chính vượt trội, dẫn đầu thị trường Corporate PPA quy mô Utility.',
                    'Công nghệ dự báo tải và quản lý lưới điện tiên tiến.'
                ],
                weaknesses: [
                    'Định hướng dự án quy mô lưới (Utility-scale) tạo khoảng trống ở phân khúc C&I vừa và nhỏ.',
                    'Phụ thuộc lớn vào quy hoạch kinh tế vĩ mô của nước sở tại.'
                ],
                services: ['Corporate PPA', 'Dự án Utility-scale', 'Thủy điện & Địa nhiệt', 'Giải pháp Hybrid (Mặt trời + Gió + BESS)', 'Hydro Xanh', 'Công nghệ Agri-PV', 'Tối ưu Phụ tải (Demand Response)'],
                color: 'from-green-500 to-emerald-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200'
            },
            {
                name: 'BayWa r.e. (Đức / Toàn cầu)',
                website: 'https://www.baywa-re.com',
                focus: 'Dịch vụ EPC & Phân phối thiết bị',
                profile: {
                    founded: '2009',
                    hq: 'Munich, Đức',
                    scale: '>5.000 nhân sự tại 34 quốc gia',
                    revenue: '~5.8 tỷ EUR (2023)',
                    key_markets: 'Châu Âu, APAC, Bắc Mỹ'
                },
                stp: {
                    segmentation: 'Thị trường C&I và dự án đặc thù (Agri-PV, Floating PV).',
                    targeting: 'Nhà thầu EPC, chủ đầu tư nông nghiệp và thương mại.',
                    positioning: 'Nhà cung cấp giải pháp tích hợp với chuỗi cung ứng thiết bị tối ưu.'
                },
                desc: 'Tập đoàn đa quốc gia có sức mạnh cốt lõi trong việc phân phối sỉ vật tư và thi công EPC.',
                strengths: [
                    'Lợi thế chuỗi cung ứng vật tư, tối ưu trực tiếp chi phí (LCOE) và tiến độ thi công.',
                    'Tiên phong công nghệ Floating Solar và Agri-PV.'
                ],
                weaknesses: [
                    'Chịu áp lực cạnh tranh giá gay gắt từ các đối thủ EPC Châu Á.',
                    'Hệ sinh thái phần mềm (Software) quản lý năng lượng chưa sâu rộng.'
                ],
                services: ['Phân phối sỉ Thiết bị', 'Tổng thầu EPC', 'Vận hành O&M', 'Cấu trúc Corporate PPA', 'Giao dịch Năng lượng (Energy Trading)', 'Điện mặt trời Nổi (Floating Solar)', 'Agri-PV'],
                color: 'from-orange-500 to-amber-500',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200'
            },
            {
                name: 'TotalEnergies - DG (Pháp / Toàn cầu)',
                website: 'https://renewables.totalenergies.com',
                focus: 'Điện mặt trời phân tán & ESCO',
                profile: {
                    founded: '1924 (Tập đoàn mẹ)',
                    hq: 'Courbevoie, Pháp',
                    scale: 'Mục tiêu 100 GW NLTT năm 2030',
                    revenue: '~218 tỷ USD (Toàn tập đoàn - 2023)',
                    key_markets: 'Châu Á, Trung Đông, Châu Âu'
                },
                stp: {
                    segmentation: 'Khách hàng C&I tìm kiếm mô hình tài trợ vốn chuyển đổi xanh.',
                    targeting: 'Nhà máy FDI, doanh nghiệp chuỗi cung ứng yêu cầu chứng nhận sạch.',
                    positioning: 'Đối tác đầu tư vững chắc, tuân thủ chuẩn mực an toàn quốc tế khắt khe.'
                },
                desc: 'Nhánh Năng lượng Phân tán (DG) cung cấp giải pháp điện mặt trời áp mái qua cấu trúc tài chính ESCO.',
                strengths: [
                    'Nguồn vốn dồi dào, cung cấp giải pháp loại bỏ rủi ro CAPEX cho khách hàng.',
                    'Khung tiêu chuẩn An toàn Sức khỏe Môi trường (HSE) vượt trội.'
                ],
                weaknesses: [
                    'Quy trình thẩm định tín dụng (Credit Assessment) nghiêm ngặt giới hạn khả năng tiếp cận phân khúc doanh nghiệp nội địa nhỏ.',
                    'Thời gian ra quyết định đầu tư kém linh hoạt hơn các quỹ khu vực.'
                ],
                services: ['Tài trợ vốn ESCO/PPA', 'Thi công EPC', 'Lưu trữ BESS', 'Microgrid Đa năng lượng', 'Quản lý Đội xe Điện (EV Fleet)', 'Chứng chỉ I-REC & Bù đắp Carbon'],
                color: 'from-rose-600 to-red-700',
                bgColor: 'bg-rose-50',
                borderColor: 'border-rose-200'
            },
            {
                name: 'Ameresco (Mỹ / Toàn cầu)',
                website: 'https://www.ameresco.com',
                focus: 'Hiệu quả Năng lượng & ESCO',
                profile: {
                    founded: '2000',
                    hq: 'Framingham, Massachusetts, Mỹ',
                    scale: '>1.500 nhân sự',
                    revenue: '>1.3 tỷ USD (2023)',
                    key_markets: 'Bắc Mỹ, Vương Quốc Anh'
                },
                stp: {
                    segmentation: 'Cơ sở có chi phí vận hành cao cần tối ưu ngân sách cấp thiết.',
                    targeting: 'Cơ quan chính phủ, giáo dục, y tế và nhà máy công nghiệp.',
                    positioning: 'Nhà tích hợp giải pháp tối ưu tiêu thụ và sản xuất năng lượng toàn diện.'
                },
                desc: 'Dẫn đầu về Hợp đồng Hiệu suất Năng lượng (ESPC), chú trọng nâng cấp hiệu suất trước khi cấp điện.',
                strengths: [
                    'Chuyên môn thiết kế hợp đồng ESPC, lấy tiền tiết kiệm tài trợ ngược cho chi phí dự án.',
                    'Năng lực tích hợp đa hệ thống: HVAC, chiếu sáng LED và năng lượng mặt trời.'
                ],
                weaknesses: [
                    'Hiện diện mờ nhạt tại thị trường Châu Á.',
                    'Chi phí kiểm toán năng lượng toàn diện là rào cản với nhóm doanh nghiệp quy mô nhỏ.'
                ],
                services: ['Kiểm toán & Nâng cấp Hiệu suất (HVAC/LED)', 'Tài chính ESPC', 'Microgrid & BESS', 'Khí tự nhiên Tái tạo (RNG) & Biogas', 'Chiếu sáng Thông minh', 'An ninh Mạng Lưới điện'],
                color: 'from-teal-600 to-cyan-700',
                bgColor: 'bg-teal-50',
                borderColor: 'border-teal-200'
            },
            {
                name: 'Envision Group (Trung Quốc)',
                website: 'https://www.envision-group.com',
                focus: 'Khu công nghiệp Net Zero & AIoT',
                profile: {
                    founded: '2007',
                    hq: 'Thượng Hải, Trung Quốc',
                    scale: 'Hiện diện >20 quốc gia',
                    revenue: 'Tập đoàn tư nhân (Quy mô Top Tier)',
                    key_markets: 'Trung Quốc, APAC, Châu Âu'
                },
                stp: {
                    segmentation: 'Chính phủ và tập đoàn cần chuyển đổi toàn bộ hạ tầng sang trung hòa carbon.',
                    targeting: 'Chủ đầu tư Khu công nghiệp, Chính quyền đô thị thông minh.',
                    positioning: 'Đối tác công nghệ Net Zero, xử lý bài toán phát thải bằng trí tuệ nhân tạo.'
                },
                desc: 'Nhà tích hợp hệ thống tiên phong mô hình Khu công nghiệp Net Zero khép kín.',
                strengths: [
                    'Nền tảng AIoT (EnOS) quản lý tối ưu hóa sản xuất và tiêu thụ điện quy mô lớn.',
                    'Đóng gói thành công mô hình tích hợp Nguồn phát - Lưu trữ - Phụ tải (Net Zero Industrial Park).'
                ],
                weaknesses: [
                    'Gặp rào cản bảo mật dữ liệu và địa chính trị khi triển khai phần mềm EnOS tại Âu-Mỹ.',
                    'Mức độ phức tạp hệ sinh thái yêu cầu khách hàng phải có hạ tầng số hóa tương xứng.'
                ],
                services: ['Phát triển Khu công nghiệp Net Zero', 'Hệ điều hành AIoT EnOS', 'Lưu trữ BESS (AESC)', 'Tuabin gió Thông minh', 'Phần mềm Quản trị Carbon (Ark)', 'Hệ sinh thái Hydro Xanh'],
                color: 'from-cyan-600 to-teal-700',
                bgColor: 'bg-cyan-50',
                borderColor: 'border-cyan-200'
            },
            {
                name: 'Solarvest (Malaysia / ASEAN)',
                website: 'https://solarvest.my',
                focus: 'Giải pháp Chuyển đổi Xanh phân khúc C&I',
                profile: {
                    founded: '2012',
                    hq: 'Petaling Jaya, Malaysia',
                    scale: 'Mở rộng khắp Đông Nam Á',
                    revenue: '~395 triệu MYR (2023)',
                    key_markets: 'Malaysia, Việt Nam, Đài Loan, Indonesia'
                },
                stp: {
                    segmentation: 'Thị trường C&I nội địa ASEAN cần chuyển dịch năng lượng và tối ưu chi phí.',
                    targeting: 'Doanh nghiệp thương mại, chuỗi bán lẻ, nhà máy công nghiệp.',
                    positioning: 'Chuyên gia kiến tạo giải pháp năng lượng sạch toàn diện, dẫn dắt khu vực.'
                },
                desc: 'Tổ chức tư vấn và phát triển năng lượng tái tạo nổi bật với hệ sinh thái cá nhân hóa tại ASEAN.',
                strengths: [
                    'Cấu trúc dịch vụ hoàn chỉnh (Powervest, Powerbee, Vestech) đáp ứng cả tài chính và công nghệ.',
                    'Thấu hiểu tường tận pháp lý và văn hóa kinh doanh khối ASEAN.'
                ],
                weaknesses: [
                    'Định vị thương hiệu chưa thể cạnh tranh trực tiếp với khối MNCs từ Âu-Mỹ.',
                    'Phụ thuộc chủ yếu vào công nghệ điện mặt trời thay vì đa dạng hóa nguồn năng lượng (dù đang dịch chuyển).'
                ],
                services: ['Tổng thầu EPC (Mặt trời & Gió)', 'Tài trợ vốn Powervest (Zero-CAPEX PPA)', 'Giải pháp Trạm sạc EV (Powerbee)', 'Phần mềm Quản trị (Vestech/Solar AI)', 'Vận hành & Bảo trì O&M', 'Tư vấn & Giao dịch Chứng chỉ I-REC', 'Tư vấn Chương trình Điện xanh (CGPP)', 'Kiểm toán Hiệu quả Năng lượng (EE)'],
                color: 'from-teal-500 to-emerald-600',
                bgColor: 'bg-teal-50',
                borderColor: 'border-teal-200'
            }
        ];

        // --- COMPONENTS ---
        const SidebarItem = ({ icon, text, active, onClick }) => (
            <button
                onClick={onClick}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${active
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
            >
                <div className={`${active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {icon}
                </div>
                <span className="text-sm tracking-wide">{text}</span>
            </button>
        );

        const SectionHeader = ({ title, subtitle, icon: Icon, colorClass }) => (
            <div className={`rounded-3xl p-8 text-white shadow-lg relative overflow-hidden mb-8 ${colorClass}`}>
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                    {Icon && <Icon className="w-48 h-48" />}
                </div>
                <div className="relative z-10 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">{title}</h2>
                    <p className="text-lg opacity-90 leading-relaxed font-medium">{subtitle}</p>
                </div>
            </div>
        );

        const BrandLogo = () => (
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-800">365<span className="text-emerald-600">ENERGY</span></span>
            </div>
        );

        function App() {
            const [activeTab, setActiveTab] = useState('overview');
            const [selectedEnergy, setSelectedEnergy] = useState(ENERGY_TYPES[0]);
            const [isEditMode, setIsEditMode] = useState(false);

            const renderContent = () => {
                switch (activeTab) {
                    case 'overview':
                        return (
                            <div className="space-y-8 animate-fade-in">
                                <SectionHeader
                                    title="Tổng quan Bức tranh Năng lượng"
                                    subtitle="Chuyển dịch năng lượng là yêu cầu sống còn để tái định hình năng lực cạnh tranh trong chuỗi cung ứng toàn cầu."
                                    icon={Globe}
                                    colorClass="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900"
                                />

                                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center border-l-4 border-amber-500 pl-3">
                                        Động lực Vĩ mô Toàn cầu (Global Macro Drivers)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 transition-colors group">
                                            <h4 className="font-bold text-slate-800 mb-3 flex items-center"><Scale className="w-5 h-5 mr-2 text-indigo-600 group-hover:scale-110 transition-transform" /> Chuyển đổi sang Tuân thủ Bắt buộc</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Các đạo luật môi trường quốc tế (như CSRD) và cơ chế CBAM yêu cầu doanh nghiệp công bố dấu chân carbon bắt buộc nhằm duy trì hợp đồng xuất khẩu và tránh thuế phạt.
                                            </p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 transition-colors group">
                                            <h4 className="font-bold text-slate-800 mb-3 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-emerald-600 group-hover:scale-110 transition-transform" /> Định tuyến Dòng vốn (Capital Shift)</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Tín dụng xanh định tuyến nguồn lực tài trợ cho các tài sản chuẩn ESG, thúc đẩy mô hình đầu tư năng lượng không vốn (ESCO/PPA) thành công cụ đòn bẩy ưu việt.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center border-l-4 border-rose-500 pl-3">
                                        Cục diện Thị trường Việt Nam (2024 - 2030)
                                    </h3>
                                    <div className="space-y-5">
                                        <div className="p-6 bg-indigo-50/50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 items-start">
                                            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                                                <Network className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-indigo-900 mb-2">Bước ngoặt Pháp lý Cơ chế DPPA</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    Nghị định 80/2024/NĐ-CP cho phép khách hàng tiêu thụ lớn mua điện trực tiếp từ các dự án năng lượng tái tạo, giải quyết bài toán nguồn cung điện sạch quy mô lớn.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 items-start">
                                            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                                                <Leaf className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-emerald-900 mb-2">Quy hoạch Điện VIII (PDP8) & JETP</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    Cơ chế khuyến khích không giới hạn công suất đối với điện mặt trời mái nhà tự sản tự tiêu thiết lập nền tảng pháp lý mở cho phân khúc năng lượng C&I.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-6 pl-1 border-l-4 border-slate-800">3 Trụ cột Chuyển dịch Công nghệ</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <LineChart className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-3">Phân tán hóa (Decentralization)</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">Phát triển hệ thống vi lưới (Microgrids) và năng lượng phân tán, gia tăng tính tự chủ an ninh năng lượng cho cơ sở sản xuất.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
                                        <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-5 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                            <Battery className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-3">Tích hợp Lưu trữ (BESS)</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">Giải quyết triệt để tính gián đoạn của năng lượng tái tạo, cung cấp công cụ dịch chuyển phụ tải (Peak Shaving) hiệu quả.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
                                        <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-5 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-3">Số hóa Dữ liệu (Digitalization)</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">Ứng dụng IoT giám sát thời gian thực, đo lường tự động phát thải carbon phục vụ các đợt kiểm toán ESG khắt khe.</p>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'glossary':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Khung Tiêu chuẩn & Thuật ngữ Chuyên ngành"
                                    subtitle="Hệ thống hóa các khái niệm vĩ mô, cơ chế tài chính và pháp lý thương mại xanh - Nền tảng ra quyết định cho Ban Lãnh đạo."
                                    icon={BookMarked}
                                    colorClass="bg-gradient-to-br from-emerald-800 to-teal-700"
                                />
                                <div className="space-y-6">
                                    {GLOSSARY_TERMS.map((cat, idx) => (
                                        <div key={idx} className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-colors`}>
                                            <div className={`px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center`}>
                                                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 mr-4">
                                                    {cat.icon}
                                                </div>
                                                <h3 className={`text-lg font-bold text-slate-800`}>{cat.category}</h3>
                                            </div>
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                    {cat.items.map((item, i) => (
                                                        <div key={i} className="flex flex-col group">
                                                            <dt className="text-base font-bold text-slate-800 mb-2 flex items-center">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2 group-hover:bg-emerald-500 transition-colors"></span>
                                                                {item.term}
                                                            </dt>
                                                            <dd className="text-sm text-slate-600 leading-relaxed text-justify">
                                                                {item.def}
                                                            </dd>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );

                    case 'sources':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Danh mục Công nghệ Năng lượng"
                                    subtitle="Đánh giá chiến lược giải pháp chuyển hóa năng lượng, từ công nghệ trưởng thành đến xu hướng định hình tương lai."
                                    icon={Cpu}
                                    colorClass="bg-gradient-to-br from-blue-800 to-indigo-700"
                                />
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="w-full lg:w-1/3 flex flex-col gap-3">
                                        {ENERGY_TYPES.map(energy => (
                                            <button
                                                key={energy.id}
                                                onClick={() => setSelectedEnergy(energy)}
                                                className={`flex items-center space-x-4 p-4 rounded-xl border transition-all text-left ${selectedEnergy.id === energy.id
                                                        ? `bg-white border-slate-800 shadow-md ring-1 ring-slate-800`
                                                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${energy.color}`}>
                                                    {energy.icon}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold ${selectedEnergy.id === energy.id ? 'text-slate-900' : 'text-slate-700'}`}>{energy.name}</h4>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="w-full lg:w-2/3">
                                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm h-full">
                                            <div className="flex items-start space-x-5 mb-8 pb-8 border-b border-slate-100">
                                                <div className={`p-4 rounded-2xl ${selectedEnergy.color}`}>
                                                    {selectedEnergy.icon}
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedEnergy.name}</h2>
                                                    <p className="text-slate-600 leading-relaxed text-sm">{selectedEnergy.desc}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-8">
                                                <div>
                                                    <h4 className="text-sm uppercase tracking-wider font-bold text-slate-500 mb-3 flex items-center">
                                                        <Layers className="w-4 h-4 mr-2" /> Cơ sở Kỹ thuật
                                                    </h4>
                                                    <p className="text-slate-700 text-sm leading-relaxed mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                        {selectedEnergy.principle}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {selectedEnergy.tech.map(t => (
                                                            <span key={t} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium shadow-sm">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
                                                        <h4 className="font-bold text-emerald-800 mb-4 flex items-center text-sm uppercase tracking-wider">
                                                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" /> Ưu thế Chiến lược
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {selectedEnergy.pros.map((pro, i) => (
                                                                <li key={i} className="text-sm text-slate-700 flex items-start leading-relaxed">
                                                                    <span className="text-emerald-500 mr-2 font-bold">•</span> {pro}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100">
                                                        <h4 className="font-bold text-rose-800 mb-4 flex items-center text-sm uppercase tracking-wider">
                                                            <AlertTriangle className="w-4 h-4 mr-2 text-rose-600" /> Rủi ro & Hạn chế
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {selectedEnergy.cons.map((con, i) => (
                                                                <li key={i} className="text-sm text-slate-700 flex items-start leading-relaxed">
                                                                    <span className="text-rose-500 mr-2 font-bold">•</span> {con}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'b2b':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Động lực Đầu tư Doanh nghiệp (C&I Insights)"
                                    subtitle="Giải mã cấu trúc ra quyết định của C-Level: Chuyển đổi xanh là chiến lược phòng vệ rủi ro và bảo vệ thị phần xuất khẩu toàn cầu."
                                    icon={Target}
                                    colorClass="bg-gradient-to-br from-indigo-800 to-slate-800"
                                />

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                                <Building className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Doanh nghiệp Nội địa</h3>
                                            <p className="text-sm text-slate-500 font-medium">SME, Mid-cap, Cơ sở hạ tầng thương mại, Nhà máy Tier 2/3</p>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="mb-8">
                                                <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center">
                                                    <DollarSign className="w-5 h-5 mr-2 text-emerald-600" /> Mục tiêu Chiến lược (Core Objectives)
                                                </h4>
                                                <ul className="space-y-3 text-slate-700 text-sm">
                                                    <li className="flex items-start">
                                                        <CheckCircle className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                                                        <span className="leading-relaxed"><strong>Phòng vệ Rủi ro (Cost Hedging):</strong> Khóa giá điện dài hạn nhằm bảo vệ biên lợi nhuận hoạt động trước sức ép lạm phát năng lượng.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                                                        <span className="leading-relaxed"><strong>Chuyển đổi CAPEX thành OPEX:</strong> Sử dụng mô hình tài trợ vốn (ESCO/PPA) để gia tăng 100% thanh khoản vốn lưu động.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="mt-auto bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                                                <h4 className="font-bold text-orange-800 mb-4 text-sm uppercase tracking-wider flex items-center">
                                                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" /> Các Thách thức Vận hành (Pain Points)
                                                </h4>
                                                <ul className="space-y-4 text-slate-700 text-sm">
                                                    <li className="flex items-start">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 mr-3 shrink-0"></span>
                                                        <span className="leading-relaxed"><strong>Giới hạn Tín dụng:</strong> Hồ sơ tài chính chưa đạt chuẩn kiểm toán khiến việc tiếp cận quỹ FDI gặp rào cản.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 mr-3 shrink-0"></span>
                                                        <span className="leading-relaxed"><strong>Điểm nghẽn Hạ tầng:</strong> Rủi ro kiểm định kết cấu chịu tải và thẩm duyệt PCCC hiện hành tại nhà xưởng cũ.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 mr-3 shrink-0"></span>
                                                        <span className="leading-relaxed"><strong>Áp lực Chuỗi cung ứng:</strong> Nguy cơ mất hợp đồng xuất khẩu nếu không đáp ứng lộ trình xanh hóa từ Tier 1 Vendors.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                                <Globe className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Tập đoàn Đa quốc gia (FDI)</h3>
                                            <p className="text-sm text-slate-500 font-medium">Vendor cấp 1, Định chế toàn cầu, Chuỗi bán lẻ quốc tế</p>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="mb-8">
                                                <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center">
                                                    <Target className="w-5 h-5 mr-2 text-blue-600" /> Mục tiêu Chiến lược (Core Objectives)
                                                </h4>
                                                <ul className="space-y-3 text-slate-700 text-sm">
                                                    <li className="flex items-start">
                                                        <CheckCircle className="w-4 h-4 mr-2 text-blue-500 shrink-0 mt-0.5" />
                                                        <span className="leading-relaxed"><strong>Tuân thủ ESG (Global Compliance):</strong> Hoàn thành báo cáo Net Zero/RE100 đáp ứng tiêu chuẩn Tập đoàn mẹ.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle className="w-4 h-4 mr-2 text-blue-500 shrink-0 mt-0.5" />
                                                        <span className="leading-relaxed"><strong>Vượt Rào cản Thương mại:</strong> Cung cấp hồ sơ minh chứng miễn trừ thuế carbon (CBAM) vào thị trường Âu-Mỹ.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="mt-auto bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                                <h4 className="font-bold text-blue-800 mb-4 text-sm uppercase tracking-wider flex items-center">
                                                    <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" /> Các Thách thức Vận hành (Pain Points)
                                                </h4>
                                                <ul className="space-y-4 text-slate-700 text-sm">
                                                    <li className="flex items-start">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 shrink-0"></span>
                                                        <span className="leading-relaxed"><strong>Tính Toàn vẹn Dữ liệu (EACs Integrity):</strong> Năng lực quản trị và truy xuất Tín chỉ I-REC chặt chẽ để loại trừ rủi ro kiểm toán đếm kép.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 shrink-0"></span>
                                                        <span className="leading-relaxed"><strong>Tuân thủ HSE Tuyệt đối:</strong> Yêu cầu nhà thầu vận hành tuân thủ quy chuẩn an toàn lao động, cam kết 100% không gián đoạn sản xuất (Zero-downtime).</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 shrink-0"></span>
                                                        <span className="leading-relaxed"><strong>Thủ tục Pháp lý Bản địa:</strong> Khó khăn trong việc xử lý quy hoạch điện lực và cấp phép PCCC chuyên ngành tại Việt Nam.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'export':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Khung Pháp lý & Tiêu chuẩn Thương mại"
                                    subtitle="Năng lượng tái tạo là 'tấm hộ chiếu' bắt buộc để hàng hóa vượt qua các hàng rào quy chuẩn khí hậu toàn cầu."
                                    icon={FileText}
                                    colorClass="bg-gradient-to-br from-teal-800 to-emerald-900"
                                />

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
                                        <div className="p-5 bg-rose-50 text-rose-600 rounded-2xl shrink-0 border border-rose-100"><Globe className="w-8 h-8" /></div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-3">Cơ chế Điều chỉnh Biên giới Carbon (CBAM - Châu Âu)</h3>
                                            <p className="text-slate-600 mb-4 leading-relaxed text-sm">Thiết lập định giá carbon lên hàng hóa nhập khẩu vào EU. Ứng dụng điện mặt trời thay thế điện lưới giúp giảm thiểu tỷ lệ "Carbon nhúng" (Embedded Carbon), bảo vệ biên lợi nhuận của doanh nghiệp xuất khẩu.</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
                                        <div className="p-5 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 border border-indigo-100"><Activity className="w-8 h-8" /></div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-3">Cam kết Mục tiêu Khoa học (SBTi)</h3>
                                            <p className="text-slate-600 mb-4 leading-relaxed text-sm">Tiêu chuẩn vàng buộc doanh nghiệp thiết lập lộ trình giảm phát thải 1.5°C. Sự tuân thủ SBTi từ các Tập đoàn đa quốc gia sẽ tạo hiệu ứng Domino ép buộc toàn bộ chuỗi cung ứng (Scope 3) chuyển đổi sử dụng năng lượng sạch.</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
                                        <div className="p-5 bg-blue-50 text-blue-600 rounded-2xl shrink-0 border border-blue-100"><BarChart className="w-8 h-8" /></div>
                                        <div className="w-full">
                                            <h3 className="text-xl font-bold text-slate-800 mb-4">Quản trị Khí nhà kính (GHG Protocol)</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="border border-slate-100 p-5 rounded-xl bg-slate-50 opacity-80">
                                                    <strong className="block text-slate-800 mb-2">Scope 1 (Trực tiếp)</strong>
                                                    <p className="text-xs text-slate-500 leading-relaxed">Phát thải từ tài sản do doanh nghiệp vận hành trực tiếp.</p>
                                                </div>
                                                <div className="border-2 border-emerald-400 p-5 rounded-xl bg-emerald-50/50 relative shadow-sm">
                                                    <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">Trọng tâm Can thiệp</div>
                                                    <strong className="block text-emerald-800 mb-2">Scope 2 (Gián tiếp)</strong>
                                                    <p className="text-xs text-emerald-700 leading-relaxed font-medium">Phát thải từ lượng điện năng tiêu thụ. Việc ứng dụng năng lượng tái tạo triệt tiêu trực tiếp chỉ số này.</p>
                                                </div>
                                                <div className="border border-slate-100 p-5 rounded-xl bg-slate-50 opacity-80">
                                                    <strong className="block text-slate-800 mb-2">Scope 3 (Chuỗi giá trị)</strong>
                                                    <p className="text-xs text-slate-500 leading-relaxed">Phát thải liên đới phát sinh từ toàn bộ chuỗi cung ứng.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0"><Award className="w-6 h-6" /></div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-2">Công cụ Chứng nhận I-REC</h3>
                                                <p className="text-slate-600 leading-relaxed text-sm">Giao dịch PPA kèm chứng nhận I-REC là chiến lược tối ưu xác thực 100% điện xanh, đáp ứng tiêu chuẩn khắt khe từ các nhãn hàng RE100.</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl shrink-0"><Building className="w-6 h-6" /></div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-2">Công trình Xanh (LEED/EDGE)</h3>
                                                <p className="text-slate-600 leading-relaxed text-sm">Năng lượng tái tạo gia tăng chỉ số đánh giá chứng nhận xây dựng bền vững, nâng tầm định giá cho bất động sản công nghiệp.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'audit':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Khảo sát Chuỗi cung ứng (ESG Audit)"
                                    subtitle="Giải mã lăng kính của tổ chức kiểm toán độc lập: Thiết lập ranh giới rõ ràng giữa các tuyên bố truyền thông và dữ liệu có giá trị pháp lý."
                                    icon={FileSearch}
                                    colorClass="bg-gradient-to-br from-slate-900 to-indigo-950"
                                />

                                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-6">
                                    <p className="text-slate-700 leading-relaxed text-lg font-medium">
                                        Kiểm toán ESG yêu cầu <strong>Dấu vết Dữ liệu (Audit Trail)</strong> minh bạch thay vì các tuyên bố chủ quan. Hệ sinh thái 365Energy cung cấp <strong>Bộ hồ sơ minh chứng (Evidence Package)</strong> nguyên khối, bảo vệ tính tuân thủ của doanh nghiệp trước mọi yêu cầu soát xét (Due Diligence).
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-200 pb-3">
                                            <ClipboardCheck className="w-6 h-6 mr-3 text-rose-600" />
                                            Tiêu điểm Kiểm toán (Auditor's Focus)
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center">
                                                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span> 1. Toàn vẹn Dữ liệu (Data Integrity)
                                                </h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Dữ liệu sản lượng được trích xuất tự động qua công tơ hay nhập liệu thủ công? Rủi ro chỉnh sửa (tampering) dữ liệu trước khi xuất báo cáo có bị loại trừ?
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center">
                                                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span> 2. Rủi ro Đếm kép (Double Counting)
                                                </h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Kiểm chứng tính duy nhất quyền sở hữu chứng nhận giảm phát thải (Scope 2). Tránh việc nhà máy và nhà tài trợ vốn cùng sử dụng chung một tín chỉ môi trường.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center">
                                                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span> 3. Đánh giá Vòng đời (LCA & Circularity)
                                                </h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Đo lường "Carbon nhúng" (Embedded Carbon) cấu thành thiết bị. Phương pháp xử lý tài sản cuối vòng đời (End-of-Life) có tuân thủ nguyên tắc kinh tế tuần hoàn?
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center">
                                                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span> 4. Tuân thủ Pháp lý (Regulatory Baseline)
                                                </h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Hệ thống hạ tầng vật lý có bảo đảm hồ sơ thẩm duyệt an toàn tĩnh tải và nghiệm thu PCCC chuyên ngành từ cơ quan chức năng?
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border-2 border-emerald-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-10 shadow-sm">
                                            Cấu trúc bởi 365Energy
                                        </div>
                                        <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center border-b border-emerald-100 pb-3">
                                            <ShieldCheck className="w-6 h-6 mr-3 text-emerald-600" />
                                            Khung Giải trình Nguyên khối
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-bold text-emerald-700 text-sm uppercase tracking-wider mb-2">1. Dữ liệu Đơn nhất (Single Source of Truth)</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    Mã hóa tự động dữ liệu hệ thống SCADA/EMS lên nền tảng Cloud. Bảo đảm thông số theo khung <strong>GHG Protocol</strong> khớp tuyệt đối với nhật ký thiết bị vật lý.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-emerald-700 text-sm uppercase tracking-wider mb-2">2. Định danh Thuộc tính (EACs Ownership)</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    Ủy thác quy trình đăng ký, phát hành và <strong>Hủy (Retire)</strong> tín chỉ trên hệ thống <em>The I-REC Standard</em>, triệt tiêu rủi ro tranh chấp chứng nhận phát thải.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-emerald-700 text-sm uppercase tracking-wider mb-2">3. Vòng đời Tuần hoàn (Circularity)</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    Triển khai thiết bị Tier-1 kèm <strong>Tuyên bố Môi trường Sản phẩm (EPD)</strong>. Cung cấp cam kết thu hồi tái chế tấm pin (EoL), đáp ứng chuẩn CSRD.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-emerald-700 text-sm uppercase tracking-wider mb-2">4. Hồ sơ Hoàn công (Bulletproof Compliance)</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    Bàn giao trọn gói <strong>As-built Dossier</strong> gồm chứng nhận an toàn kết cấu và biên bản nghiệm thu PCCC, tối ưu hóa năng lực vượt kiểm toán.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'brands':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Bản đồ Năng lực Cạnh tranh Toàn cầu"
                                    subtitle="Phân tích chiến lược của các tập đoàn cung cấp giải pháp chuyển đổi xanh toàn diện (EPC, O&M, PPA, ESG) trên thế giới."
                                    icon={Trophy}
                                    colorClass="bg-gradient-to-br from-slate-800 to-slate-900"
                                />

                                <div className="space-y-6">
                                    {GLOBAL_BRANDS.map((brand, idx) => (
                                        <div key={idx} className={`bg-white rounded-2xl border-2 ${brand.borderColor} shadow-sm overflow-hidden flex flex-col xl:flex-row group hover:shadow-lg transition-all`}>
                                            <div className={`xl:w-[35%] bg-gradient-to-br ${brand.color} p-8 text-white flex flex-col justify-between`}>
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-3 tracking-tight">{brand.name}</h3>
                                                    <div className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm border border-white/30 shadow-sm">
                                                        {brand.focus}
                                                    </div>
                                                    <p className="text-white/90 text-sm leading-relaxed mb-8 font-medium">
                                                        {brand.desc}
                                                    </p>
                                                </div>

                                                {brand.profile && (
                                                    <div className="space-y-3 text-sm text-white/95 bg-black/20 p-6 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm">
                                                        <h4 className="font-bold border-b border-white/20 pb-3 mb-4 text-white uppercase tracking-wider text-xs">Hồ sơ Năng lực (Profile)</h4>
                                                        <div className="flex items-start">
                                                            <Calendar className="w-4 h-4 mr-3 shrink-0 mt-0.5 opacity-70" />
                                                            <span className="leading-relaxed"><strong>Thành lập:</strong> {brand.profile.founded}</span>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <MapPin className="w-4 h-4 mr-3 shrink-0 mt-0.5 opacity-70" />
                                                            <span className="leading-relaxed"><strong>Trụ sở:</strong> {brand.profile.hq}</span>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <Users className="w-4 h-4 mr-3 shrink-0 mt-0.5 opacity-70" />
                                                            <span className="leading-relaxed"><strong>Quy mô:</strong> {brand.profile.scale}</span>
                                                        </div>
                                                        {brand.profile.revenue && (
                                                            <div className="flex items-start">
                                                                <DollarSign className="w-4 h-4 mr-3 shrink-0 mt-0.5 opacity-70" />
                                                                <span className="leading-relaxed"><strong>Doanh thu:</strong> {brand.profile.revenue}</span>
                                                            </div>
                                                        )}
                                                        {brand.profile.key_markets && (
                                                            <div className="flex items-start">
                                                                <Globe className="w-4 h-4 mr-3 shrink-0 mt-0.5 opacity-70" />
                                                                <span className="leading-relaxed"><strong>Thị trường:</strong> {brand.profile.key_markets}</span>
                                                            </div>
                                                        )}
                                                        {brand.website && (
                                                            <div className="flex items-start pt-3 mt-2 border-t border-white/10">
                                                                <ExternalLink className="w-4 h-4 mr-3 shrink-0 mt-0.5 text-emerald-300" />
                                                                <a
                                                                    href={brand.website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="leading-relaxed font-bold text-emerald-300 hover:text-white transition-colors underline underline-offset-4 decoration-emerald-500/50 hover:decoration-white"
                                                                >
                                                                    Truy cập Website
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="xl:w-[65%] p-8 flex flex-col bg-white">
                                                <div className="mb-8 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                                    <div className="bg-slate-100/80 px-5 py-4 border-b border-slate-200 flex items-center">
                                                        <Layers className="w-5 h-5 mr-3 text-indigo-600" />
                                                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Cấu trúc Chiến lược (STP)</h4>
                                                    </div>
                                                    <div className="p-5 space-y-5">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <div>
                                                                <h5 className="text-xs uppercase tracking-widest font-bold text-slate-500 flex items-center mb-2"><PieChart className="w-4 h-4 mr-2 text-blue-500" /> Phân khúc (Segmentation)</h5>
                                                                <p className="text-sm text-slate-700 leading-relaxed font-medium">{brand.stp.segmentation}</p>
                                                            </div>
                                                            <div>
                                                                <h5 className="text-xs uppercase tracking-widest font-bold text-slate-500 flex items-center mb-2"><Target className="w-4 h-4 mr-2 text-rose-500" /> Mục tiêu (Targeting)</h5>
                                                                <p className="text-sm text-slate-700 leading-relaxed font-medium">{brand.stp.targeting}</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                                                            <h5 className="text-xs uppercase tracking-widest font-bold text-slate-500 flex items-center mb-2"><Award className="w-4 h-4 mr-2 text-amber-500" /> Định vị (Positioning)</h5>
                                                            <p className="text-base text-slate-800 font-bold italic">"{brand.stp.positioning}"</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                    <div>
                                                        <h4 className="flex items-center text-slate-800 font-bold mb-4 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
                                                            <Star className="w-5 h-5 mr-2 text-emerald-500" fill="currentColor" /> Điểm mạnh
                                                        </h4>
                                                        <ul className="space-y-4">
                                                            {brand.strengths.map((s, i) => (
                                                                <li key={i} className="flex items-start text-sm text-slate-600 leading-relaxed">
                                                                    <ChevronRight className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5" />{s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="flex items-center text-slate-800 font-bold mb-4 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
                                                            <AlertTriangle className="w-5 h-5 mr-2 text-rose-500" /> Điểm hạn chế
                                                        </h4>
                                                        <ul className="space-y-4">
                                                            {brand.weaknesses.map((w, i) => (
                                                                <li key={i} className="flex items-start text-sm text-slate-600 leading-relaxed">
                                                                    <ChevronRight className="w-4 h-4 mr-2 text-rose-400 shrink-0 mt-0.5" />{w}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-6 border-t border-slate-100">
                                                    <h4 className="flex items-center text-slate-500 font-bold mb-4 text-xs uppercase tracking-widest">
                                                        <Zap className="w-4 h-4 mr-2 text-amber-500" /> Hệ sinh thái Dịch vụ
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2.5">
                                                        {brand.services.map((service, i) => (
                                                            <span key={i} className={`px-4 py-2 bg-slate-50 border ${brand.borderColor} rounded-lg text-xs font-bold text-slate-700 shadow-sm hover:bg-white transition-colors`}>
                                                                {service}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );

                    case 'services_map':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Bản đồ Dịch vụ Toàn cầu (Service Map)"
                                    subtitle="Hệ thống hóa danh mục dịch vụ năng lượng, đối chiếu định tuyến chiến lược với nhu cầu trọng yếu của từng tệp khách hàng."
                                    icon={Puzzle}
                                    colorClass="bg-gradient-to-br from-violet-800 to-fuchsia-900"
                                />

                                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 flex items-start gap-4">
                                    <div className="p-3 bg-violet-50 text-violet-600 rounded-xl shrink-0"><Lightbulb className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Định tuyến Dịch vụ (Service Routing)</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            Ma trận phân bổ <strong>4 Cấu phần Dịch vụ Cốt lõi</strong> dựa trên mức độ tương thích đối với Doanh nghiệp Nội địa và Tập đoàn FDI, làm cơ sở xây dựng đề xuất giá trị (Value Proposition).
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Nhóm 1: Tài chính */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                        <div className="bg-rose-50/50 p-6 border-b border-rose-100 flex items-center">
                                            <div className="p-3 bg-white text-rose-600 shadow-sm border border-rose-100 rounded-xl mr-4"><DollarSign className="w-6 h-6" /></div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800">1. Tài trợ Vốn & Cấu trúc PPA</h3>
                                                <p className="text-sm text-slate-500 mt-1">Mô hình ESCO, Rooftop PPA, DPPA.</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                            <div className="flex-1 p-6 md:p-8 hover:bg-orange-50/30 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-wider"><Building className="w-4 h-4 mr-2 text-orange-500" /> Đối với Nội địa</h4>
                                                    <span className="bg-orange-100 text-orange-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-widest border border-orange-200">Trọng yếu</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Công cụ phòng vệ rủi ro chi phí (Cost Hedging). Chuyển đổi áp lực đầu tư (CAPEX) thành chi phí vận hành (OPEX), giải phóng dòng vốn lưu động để doanh nghiệp tái đầu tư mở rộng sản xuất.
                                                </p>
                                            </div>
                                            <div className="flex-1 p-6 md:p-8 hover:bg-blue-50/30 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-wider"><Globe className="w-4 h-4 mr-2 text-blue-500" /> Đối với FDI</h4>
                                                    <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-widest border border-blue-200">Bắt buộc (DPPA)</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Công cụ tối ưu hóa Bảng cân đối kế toán (Off-balance sheet). Cơ chế DPPA là giải pháp chiến lược mua điện tái tạo qua lưới quốc gia để hoàn thiện mục tiêu 100% RE khi bị giới hạn hạ tầng.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nhóm 2: ESG */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                        <div className="bg-emerald-50/50 p-6 border-b border-emerald-100 flex items-center">
                                            <div className="p-3 bg-white text-emerald-600 shadow-sm border border-emerald-100 rounded-xl mr-4"><Award className="w-6 h-6" /></div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800">2. Quản trị Thuộc tính Môi trường (ESG)</h3>
                                                <p className="text-sm text-slate-500 mt-1">Tín chỉ I-REC, Báo cáo GHG Protocol.</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                            <div className="flex-1 p-6 md:p-8 hover:bg-orange-50/30 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-wider"><Building className="w-4 h-4 mr-2 text-orange-500" /> Đối với Nội địa</h4>
                                                    <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-widest border border-slate-200">Tuân thủ Chuỗi cung ứng</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Đáp ứng báo cáo khí nhà kính (GHG Protocol) khi nhận sức ép tuân thủ Scope 3 từ các đối tác mua hàng (Tier 1 Vendors) nhằm duy trì hạn ngạch cung ứng xuất khẩu.
                                                </p>
                                            </div>
                                            <div className="flex-1 p-6 md:p-8 hover:bg-blue-50/30 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-wider"><Globe className="w-4 h-4 mr-2 text-blue-500" /> Đối với FDI</h4>
                                                    <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-widest border border-blue-700 shadow-sm">Điều kiện Tiên quyết</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Ủy thác quy trình đăng ký và Hủy (Retire) I-REC minh bạch, triệt tiêu rủi ro đếm kép (Double Counting). Cung cấp hồ sơ pháp lý chứng minh "sử dụng điện sạch" để miễn trừ thuế CBAM và tuân thủ SBTi.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nhóm 3: EPC */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                        <div className="bg-indigo-50/50 p-6 border-b border-indigo-100 flex items-center">
                                            <div className="p-3 bg-white text-indigo-600 shadow-sm border border-indigo-100 rounded-xl mr-4"><Cpu className="w-6 h-6" /></div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800">3. Xây lắp & Tích hợp (EPC & Storage)</h3>
                                                <p className="text-sm text-slate-500 mt-1">Tổng thầu năng lượng, Lưu trữ (BESS), Trạm sạc EV.</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                            <div className="flex-1 p-6 md:p-8 hover:bg-orange-50/30 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-wider"><Building className="w-4 h-4 mr-2 text-orange-500" /> Đối với Nội địa</h4>
                                                    <span className="bg-orange-100 text-orange-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-widest border border-orange-200">Tối ưu LCOE</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Ưu tiên mô hình tự đầu tư (Turnkey EPC) để hưởng trọn tỷ suất sinh lời. Đòi hỏi năng lực tối ưu hóa chi phí quy dẫn (LCOE) và bàn giao hồ sơ hoàn công (As-built Dossier) bảo chứng an toàn PCCC.
                                                </p>
                                            </div>
                                            <div className="flex-1 p-6 md:p-8 hover:bg-blue-50/30 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-wider"><Globe className="w-4 h-4 mr-2 text-blue-500" /> Đối với FDI</h4>
                                                    <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-widest border border-blue-200">Chuẩn HSE & LCA</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Cam kết thi công tuân thủ an toàn lao động (HSE) tuyệt đối, không gián đoạn sản xuất (Zero-downtime). Tích hợp vật tư Tier-1 chuẩn EPD và quy trình thu hồi cuối vòng đời (EoL) đáp ứng chuẩn LCA.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nhóm 4: O&M */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                        <div className="bg-cyan-50/50 p-6 border-b border-cyan-100 flex items-center">
                                            <div className="p-3 bg-white text-cyan-600 shadow-sm border border-cyan-100 rounded-xl mr-4"><Activity className="w-6 h-6" /></div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800">4. Vận hành & Dữ liệu Số (O&M & Digital)</h3>
                                                <p className="text-sm text-slate-500 mt-1">Bảo trì phòng ngừa, Nền tảng EMS/SCADA.</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                            <div className="flex-1 p-6 md:p-8 hover:bg-orange-50/30 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-wider"><Building className="w-4 h-4 mr-2 text-orange-500" /> Đối với Nội địa</h4>
                                                    <span className="bg-orange-100 text-orange-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-widest border border-orange-200">Bảo vệ Tài sản</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Thực thi nghiệp vụ bảo trì phòng ngừa (Predictive Maintenance), cam kết Tỷ lệ khả dụng (Uptime SLA) dài hạn. Nền tảng số (EMS) đóng vai trò giám sát hiệu năng sinh lời thực tế của dự án.
                                                </p>
                                            </div>
                                            <div className="flex-1 p-6 md:p-8 hover:bg-blue-50/30 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-wider"><Globe className="w-4 h-4 mr-2 text-blue-500" /> Đối với FDI</h4>
                                                    <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-widest border border-blue-700 shadow-sm">Dấu vết Kiểm toán</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Hệ thống SCADA tự động mã hóa dữ liệu lên Cloud, thiết lập "Nguồn Dữ liệu Đơn nhất" (Single Source of Truth). Cung cấp Dấu vết Kiểm toán (Audit Trail) minh bạch, chống lại mọi rủi ro thao túng số liệu.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'ecosystem':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Cấu trúc Hệ sinh thái Khép kín"
                                    subtitle="Doanh nghiệp thụ hưởng toàn bộ giá trị chuyển đổi xanh (End-to-End) thông qua một điểm chạm duy nhất được xây dựng từ 6 cấu phần cốt lõi."
                                    icon={RefreshCw}
                                    colorClass="bg-gradient-to-br from-indigo-900 to-slate-900"
                                />

                                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-6 text-center">
                                    <p className="text-slate-700 leading-relaxed text-sm md:text-base font-medium max-w-4xl mx-auto">
                                        Mô phỏng sự thành công của các hệ sinh thái Energy-as-a-Service toàn cầu, cấu trúc của 365Energy được thiết lập theo đồ họa <strong>One-Stop Solution</strong>. Tại đây, 6 phân hệ cốt lõi tương hỗ liên tục, khóa chặt mọi rủi ro vận hành và pháp lý cho khách hàng.
                                    </p>
                                </div>

                                {/* Mobile / Tablet View */}
                                <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="p-2.5 bg-violet-500/20 text-violet-400 rounded-xl border border-violet-500/30"><Settings className="w-5 h-5" /></div>
                                            <h4 className="font-bold text-white">Quản trị Chuỗi Tuần hoàn</h4>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">Ứng dụng thiết bị Tier-1 có Tuyên bố Môi trường (EPD) và quy trình xử lý thu hồi cuối vòng đời (LCA) đáp ứng tiêu chuẩn CSRD.</p>
                                    </div>
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30"><DollarSign className="w-5 h-5" /></div>
                                            <h4 className="font-bold text-white">Cấu trúc Tài chính Tối ưu</h4>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">Khai thác mô hình ESCO/PPA ngoại bảng, chuyển đổi CAPEX thành OPEX, bảo vệ dòng tiền lưu động và biên lợi nhuận kinh doanh.</p>
                                    </div>
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30"><LayoutDashboard className="w-5 h-5" /></div>
                                            <h4 className="font-bold text-white">Số hóa Dữ liệu & Vận hành</h4>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">Nền tảng SCADA cung cấp Dấu vết Kiểm toán (Audit Trail) chống tẩy xanh. Triển khai bảo trì dự đoán đảm bảo Tỷ lệ khả dụng (Uptime SLA).</p>
                                    </div>
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30"><Award className="w-5 h-5" /></div>
                                            <h4 className="font-bold text-white">Quản trị Thuộc tính Môi trường</h4>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">Đăng ký và Hủy (Retire) I-REC minh bạch. Cung cấp dữ liệu phục vụ báo cáo GHG Protocol và thiết lập lộ trình đáp ứng chuẩn SBTi.</p>
                                    </div>
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30"><ShieldCheck className="w-5 h-5" /></div>
                                            <h4 className="font-bold text-white">Tuân thủ An toàn & Pháp lý</h4>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">Xử lý hồ sơ PCCC, thỏa thuận lưới điện (EVN). Áp dụng các biện pháp thi công an toàn lao động quốc tế, cam kết Zero-downtime.</p>
                                    </div>
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30"><Cpu className="w-5 h-5" /></div>
                                            <h4 className="font-bold text-white">Giải pháp Kỹ thuật Tích hợp</h4>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">Tổng thầu thi công xây lắp (EPC). Thiết kế kiến trúc nền tảng mở, sẵn sàng cho việc tích hợp hệ thống lưu trữ năng lượng (BESS).</p>
                                    </div>
                                </div>

                                {/* Desktop View (Circular Graphic Diagram) */}
                                <div className="hidden xl:flex relative w-full bg-[#151b2b] rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-[900px] items-center justify-center overflow-hidden mt-8">

                                    {/* Background ambient lighting */}
                                    <div className="absolute inset-0 z-0">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
                                        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
                                    </div>

                                    {/* Center Logo Hub */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center w-64 h-64 bg-[#1e293b]/80 backdrop-blur-md rounded-full border border-slate-700 shadow-[0_0_60px_rgba(16,185,129,0.08)]">
                                        <h3 className="text-3xl font-extrabold text-white tracking-widest text-center mt-2">365ENERGY</h3>
                                        <div className="w-12 h-0.5 bg-emerald-500 my-3"></div>
                                        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
                                            One-Stop <br /> Solution Provider
                                        </p>
                                    </div>

                                    {/* Connecting Orbital Ring */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] border border-slate-700/30 rounded-full z-10"></div>

                                    {/* NODE 1: Quản trị Chuỗi Tuần hoàn (Top Center) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-340px] z-20 w-[340px] bg-slate-800/90 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-violet-500/50 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300">
                                                <Settings className="w-5 h-5 text-violet-400" />
                                            </div>
                                            <h4 className="font-bold text-white text-[15px] group-hover:text-violet-300 transition-colors">Quản trị Chuỗi Tuần hoàn</h4>
                                        </div>
                                        <p className="text-[13px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Ứng dụng thiết bị Tier-1 có Tuyên bố Môi trường (EPD) và quy trình xử lý thu hồi cuối vòng đời (LCA).</p>
                                    </div>

                                    {/* NODE 2: Cấu trúc Tài chính Tối ưu (Top Right) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-[380px] mt-[-170px] z-20 w-[340px] bg-slate-800/90 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300">
                                                <DollarSign className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <h4 className="font-bold text-white text-[15px] group-hover:text-blue-300 transition-colors">Cấu trúc Tài chính Tối ưu</h4>
                                        </div>
                                        <p className="text-[13px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Khai thác mô hình ESCO/PPA ngoại bảng, chuyển đổi CAPEX thành OPEX, bảo vệ dòng tiền lưu động.</p>
                                    </div>

                                    {/* NODE 3: Quản trị Thuộc tính Môi trường (Bottom Right) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-[380px] mt-[170px] z-20 w-[340px] bg-slate-800/90 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300">
                                                <Award className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <h4 className="font-bold text-white text-[15px] group-hover:text-emerald-300 transition-colors">Quản trị Thuộc tính Môi trường</h4>
                                        </div>
                                        <p className="text-[13px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Đăng ký và Hủy (Retire) I-REC minh bạch. Cung cấp dữ liệu phục vụ báo cáo GHG Protocol và chuẩn SBTi.</p>
                                    </div>

                                    {/* NODE 4: Giải pháp Kỹ thuật Tích hợp (Bottom Center) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[340px] z-20 w-[340px] bg-slate-800/90 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300">
                                                <Cpu className="w-5 h-5 text-amber-400" />
                                            </div>
                                            <h4 className="font-bold text-white text-[15px] group-hover:text-amber-300 transition-colors">Giải pháp Kỹ thuật Tích hợp</h4>
                                        </div>
                                        <p className="text-[13px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Tổng thầu thi công (EPC). Thiết kế kiến trúc mở, sẵn sàng nâng cấp hệ thống lưu trữ năng lượng (BESS).</p>
                                    </div>

                                    {/* NODE 5: Tuân thủ An toàn & Pháp lý (Bottom Left) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-[-380px] mt-[170px] z-20 w-[340px] bg-slate-800/90 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-rose-500/50 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300">
                                                <ShieldCheck className="w-5 h-5 text-rose-400" />
                                            </div>
                                            <h4 className="font-bold text-white text-[15px] group-hover:text-rose-300 transition-colors">Tuân thủ An toàn & Pháp lý</h4>
                                        </div>
                                        <p className="text-[13px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Xử lý hồ sơ PCCC, thỏa thuận lưới điện (EVN). Cam kết biện pháp thi công 100% không gián đoạn sản xuất.</p>
                                    </div>

                                    {/* NODE 6: Số hóa Dữ liệu & Vận hành (Top Left) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-[-380px] mt-[-170px] z-20 w-[340px] bg-slate-800/90 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300">
                                                <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <h4 className="font-bold text-white text-[15px] group-hover:text-cyan-300 transition-colors">Số hóa Dữ liệu & Vận hành</h4>
                                        </div>
                                        <p className="text-[13px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Nền tảng SCADA cung cấp Dấu vết Kiểm toán (Audit Trail) minh bạch. Áp dụng bảo trì dự đoán bảo vệ tài sản.</p>
                                    </div>

                                </div>
                            </div>
                        );

                    case 'strategy':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Định vị Chiến lược 365Energy"
                                    subtitle="Bước tiến hóa từ nhà thầu xây lắp trở thành Kiến trúc sư Giải pháp Năng lượng (Energy-as-a-Service), đáp ứng các chuẩn mực ESG quốc tế."
                                    icon={Rocket}
                                    colorClass="bg-gradient-to-br from-orange-600 to-amber-700"
                                />

                                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
                                    <h3 className="text-lg font-bold text-slate-800 text-center mb-8 uppercase tracking-widest">Tầm nhìn Định vị (Brand Vision)</h3>
                                    <div className="space-y-4 max-w-5xl mx-auto">
                                        <div className="p-6 bg-slate-900 rounded-2xl relative overflow-hidden group shadow-md">
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
                                            <span className="text-amber-400 font-bold mb-3 block text-xs uppercase tracking-widest">Tuyên ngôn Chiến lược</span>
                                            <p className="text-xl text-white italic font-medium leading-relaxed pl-2">
                                                "365Energy - Đối tác chiến lược cung cấp hệ sinh thái năng lượng tích hợp, đồng hành cùng doanh nghiệp tối ưu hóa nguồn vốn và kiến tạo giá trị Net Zero."
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden hover:border-blue-300 transition-colors">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                                <span className="text-blue-600 font-bold mb-2 block text-xs uppercase tracking-wider">Hệ giá trị Chuỗi Cung ứng</span>
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed pl-2">
                                                    Tích hợp giải pháp năng lượng đầu cuối, cung cấp hồ sơ kiểm toán ESG nguyên khối, thiết lập lợi thế thương mại tại thị trường xuất khẩu.
                                                </p>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden hover:border-emerald-300 transition-colors">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                                                <span className="text-emerald-600 font-bold mb-2 block text-xs uppercase tracking-wider">Hệ giá trị Quản trị Tài chính</span>
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed pl-2">
                                                    Cấu trúc nguồn vốn linh hoạt, chuyển dịch rủi cấu tư (CAPEX) thành lợi ích vận hành (OPEX), bảo vệ dòng tiền lưu động cho doanh nghiệp.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center mb-6 mt-10">
                                    <div className="w-2 h-8 bg-slate-800 rounded-full mr-4"></div>
                                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Cơ sở Năng lực Triển khai Thực tế</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-4">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800">Cam kết Hiệu suất Kỹ thuật</h4>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed text-sm mb-4">Hệ thống đo lường hiệu năng chuyên sâu. Cam kết 100% không gián đoạn sản xuất (Zero-downtime) trong quá trình lắp đặt.</p>
                                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center gap-4">
                                            <div className="text-center px-4 border-r border-slate-200">
                                                <span className="block text-2xl font-bold text-indigo-600">99%</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">Uptime SLA</span>
                                            </div>
                                            <div className="text-center px-4 border-r border-slate-200">
                                                <span className="block text-2xl font-bold text-indigo-600">Tier-1</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">Chuẩn Thiết bị</span>
                                            </div>
                                            <div className="text-center px-4">
                                                <span className="block text-2xl font-bold text-indigo-600">24/7</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">Bảo trì số</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-4">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800">Chấp pháp Tài chính & Môi trường</h4>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed text-sm mb-4">Cung cấp bộ hồ sơ minh chứng (Evidence Package) vững chắc, sẵn sàng vượt qua các khung kiểm toán Due Diligence khắt khe nhất của Big4.</p>
                                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center gap-4">
                                            <div className="text-center px-4 border-r border-slate-200">
                                                <span className="block text-2xl font-bold text-emerald-600">100%</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">Tuân thủ ESG</span>
                                            </div>
                                            <div className="text-center px-4 border-r border-slate-200">
                                                <span className="block text-2xl font-bold text-emerald-600">0 Đồng</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">Mô hình CAPEX</span>
                                            </div>
                                            <div className="text-center px-4">
                                                <span className="block text-2xl font-bold text-emerald-600">GHG</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">Chuẩn Báo cáo</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'why_us':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title="Lợi thế Cạnh tranh Trực diện (USP)"
                                    subtitle="Cơ sở định vị của Ban Lãnh đạo: Chuyển đổi mô hình phân mảnh thành hệ sinh thái tích hợp, kiểm soát rủi ro thông qua cơ chế một điểm chạm."
                                    icon={Trophy}
                                    colorClass="bg-gradient-to-br from-slate-900 to-indigo-900"
                                />

                                <div className="space-y-6 mt-8">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row group hover:shadow-lg transition-shadow">
                                        <div className="lg:w-2/5 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-center">
                                            <div className="flex items-center space-x-3 mb-5">
                                                <Cpu className="w-8 h-8 text-slate-400" />
                                                <h3 className="text-xl font-bold text-slate-800">Tổng thầu EPC Truyền thống</h3>
                                            </div>
                                            <div>
                                                <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-md mb-3">Hạn chế của Mô hình</span>
                                                <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-rose-300 pl-3">
                                                    Cạnh tranh chủ yếu qua chi phí vật tư và thi công vật lý. Thiếu hụt phương pháp luận thiết lập tài liệu kiểm toán GHG hay tổ chức cấp vốn trực tiếp.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="lg:w-3/5 p-8 bg-white relative">
                                            <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Đề xuất Giá trị 365Energy</div>
                                            <h4 className="font-bold text-emerald-700 text-xl mb-3 flex items-center">
                                                <CheckCircle className="w-6 h-6 mr-2" /> Kiến trúc Giải pháp Tích hợp
                                            </h4>
                                            <p className="text-slate-700 leading-relaxed">
                                                Chuyển đổi chi phí phần cứng thành giá trị dòng tiền thực tế. 365Energy tích hợp hạ tầng kỹ thuật và chứng nhận môi trường (ESG) vào một dịch vụ đồng nhất, bảo đảm tính logic giữa hiệu quả tài chính và số liệu kiểm toán.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row group hover:shadow-lg transition-shadow">
                                        <div className="lg:w-2/5 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-center">
                                            <div className="flex items-center space-x-3 mb-5">
                                                <DollarSign className="w-8 h-8 text-slate-400" />
                                                <h3 className="text-xl font-bold text-slate-800">Quỹ Đầu tư Tài chính (M&A)</h3>
                                            </div>
                                            <div>
                                                <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-md mb-3">Hạn chế của Mô hình</span>
                                                <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-rose-300 pl-3">
                                                    Quản lý dự án thông qua cơ chế thuê ngoài (Outsource EPC & O&M). Cấu trúc này làm phát sinh rủi ro phân tán trách nhiệm giải trình khi hệ thống gặp rủi ro vận hành.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="lg:w-3/5 p-8 bg-white relative">
                                            <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Đề xuất Giá trị 365Energy</div>
                                            <h4 className="font-bold text-blue-700 text-xl mb-3 flex items-center">
                                                <CheckCircle className="w-6 h-6 mr-2" /> Trách nhiệm Giải trình Nguyên khối
                                            </h4>
                                            <p className="text-slate-700 leading-relaxed">
                                                Loại trừ điểm mù trong khâu vận hành. 365Energy trực tiếp giải ngân vốn đầu tư, kết hợp duy trì nguồn lực kỹ sư điều hành hệ thống nhằm cam kết tính liên tục và hiệu suất O&M dài hạn.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row group hover:shadow-lg transition-shadow">
                                        <div className="lg:w-2/5 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-center">
                                            <div className="flex items-center space-x-3 mb-5">
                                                <Globe className="w-8 h-8 text-slate-400" />
                                                <h3 className="text-xl font-bold text-slate-800">Tập đoàn Đa quốc gia (Global MNCs)</h3>
                                            </div>
                                            <div>
                                                <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-md mb-3">Hạn chế của Mô hình</span>
                                                <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-rose-300 pl-3">
                                                    Quy trình ra quyết định cồng kềnh (Red tape). Hạn chế về tính linh hoạt khi tiếp cận và xử lý rào cản từ quy chuẩn PCCC, quy hoạch điện lực sở tại.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="lg:w-3/5 p-8 bg-white relative">
                                            <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Đề xuất Giá trị 365Energy</div>
                                            <h4 className="font-bold text-amber-700 text-xl mb-3 flex items-center">
                                                <CheckCircle className="w-6 h-6 mr-2" /> Năng lực Thực thi Bản địa Sắc bén
                                            </h4>
                                            <p className="text-slate-700 leading-relaxed">
                                                Khả năng giải mã rào cản hành chính nội địa. Chủ động chuẩn hóa hồ sơ thẩm duyệt phòng cháy và đấu nối lưới điện, tối ưu thời gian đưa dự án vào vận hành thương mại (Speed-to-market).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row group hover:shadow-lg transition-shadow">
                                        <div className="lg:w-2/5 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-center">
                                            <div className="flex items-center space-x-3 mb-5">
                                                <Target className="w-8 h-8 text-slate-400" />
                                                <h3 className="text-xl font-bold text-slate-800">Tư vấn Độc lập (Boutique Advisory)</h3>
                                            </div>
                                            <div>
                                                <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-md mb-3">Hạn chế của Mô hình</span>
                                                <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-rose-300 pl-3">
                                                    Cung cấp lộ trình chiến lược định dạng văn bản nhưng thiếu nền tảng thực chứng vật lý. Sự phụ thuộc vào nhà thầu thứ ba gây sai số lớn giữa chỉ số cam kết và thực tế.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="lg:w-3/5 p-8 bg-white relative">
                                            <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Đề xuất Giá trị 365Energy</div>
                                            <h4 className="font-bold text-indigo-700 text-xl mb-3 flex items-center">
                                                <CheckCircle className="w-6 h-6 mr-2" /> Cá nhân hóa Năng lực Thực chứng
                                            </h4>
                                            <p className="text-slate-700 leading-relaxed">
                                                Dịch mã yêu cầu ESG thành tham số thiết kế phần cứng chuyên biệt. Khách hàng chi trả cho <strong>Cam kết Hiệu năng (Performance Guarantee)</strong> trực quan, được chứng minh qua số liệu vận hành đo lường được trên hệ thống.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'customer_centric':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title={<EditableText id="cc_title" defaultText="Mọi Chiến Lược Đều Bắt Đầu Từ Bài Toán Của Khách Hàng" isEditMode={isEditMode} tagName="span" />}
                                    subtitle={<EditableText id="cc_subtitle" defaultText="Thương hiệu không định hình từ những gì 365 Energy có, mà từ những rào cản khách hàng C-Level đang cần tháo gỡ. Mọi dữ liệu năng lực của chúng ta đều là 'bảo chứng' để giải quyết nỗi đau của họ." isEditMode={isEditMode} tagName="span" />}
                                    icon={Users}
                                    colorClass="bg-gradient-to-br from-slate-800 to-indigo-900"
                                />

                                <div className="grid md:grid-cols-3 gap-6 mb-8 mt-8">
                                    <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">1. Sự thật thị trường</h3>
                                            <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center"><BarChart3 className="w-4 h-4" /></div>
                                        </div>
                                        <p className="text-base font-bold text-slate-900 mb-2"><EditableText id="cc_box1_title" defaultText="Sự Bão Hòa Của Mô Hình EPC Truyền Thống" isEditMode={isEditMode} tagName="span" /></p>
                                        <p className="text-sm text-slate-600 leading-relaxed"><EditableText id="cc_box1_desc" defaultText="Khi cơ chế giá FiT khép lại, theo IEEFA, thị trường từ chối việc mua bán thiết bị đơn thuần. Việc cạnh tranh bằng giá thi công đang siết chặt biên lợi nhuận của toàn ngành." isEditMode={isEditMode} tagName="span" /></p>
                                    </div>
                                    
                                    <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">2. Nỗi đau khách hàng</h3>
                                            <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center"><Target className="w-4 h-4" /></div>
                                        </div>
                                        <p className="text-base font-bold text-slate-900 mb-2">Áp Lực Kép: Dòng Tiền & Tuân Thủ ESG</p>
                                        <p className="text-sm text-slate-600 leading-relaxed">Khách hàng C-Level phải giải bài toán tối ưu OPEX (chi phí điện) và đối mặt với rào cản pháp lý mới (DPPA, CBAM, kiểm kê CO2) mà không muốn tự bỏ vốn đầu tư (Capex).</p>
                                    </div>
                                    
                                    <div className="bg-emerald-50/50 border border-emerald-200 p-7 rounded-2xl shadow-sm hover:shadow-md transition-all relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest">3. Năng lực giải quyết (365E)</h3>
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div>
                                        </div>
                                        <p className="text-base font-bold text-slate-900 mb-2">Bảo Chứng Năng Lực Vững Chắc</p>
                                        <p className="text-sm text-slate-600 leading-relaxed">Hình thành từ 2016, quản lý hơn <strong>150 dự án C&I (200MWp)</strong>, doanh thu 25M USD (2020). Sở hữu khả năng tài trợ vốn và năng lực thiết kế đạt chuẩn PCCC.</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 mt-8">
                                    <Users className="text-emerald-600 w-5 h-5" />
                                    Ma Trận Giải Pháp Cho Từng Phân Khúc (Target Audience)
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded mb-4 inline-block tracking-widest">Tập đoàn Đa quốc gia (FDI)</span>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Chuỗi Cung Ứng Toàn Cầu</h4>
                                        <p className="text-sm text-slate-600 mb-5 leading-relaxed"><strong>Nỗi đau:</strong> Bị áp đặt cam kết RE100. Sợ nhất rủi ro cháy nổ làm đình trệ sản xuất chuỗi cung ứng.</p>
                                        
                                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                            <p className="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-1">Giải pháp từ 365 Energy:</p>
                                            <p className="text-sm text-slate-800 font-medium mb-3">Mô hình Zero-Capex (PPA), cung cấp I-REC (qua 365 Exergy) & Cam kết thi công đạt chuẩn FM Global.</p>
                                            <div className="pt-3 border-t border-slate-200">
                                                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                                    <strong>Bảo chứng thực tế:</strong> Schindler, Dunlopillo, BAT.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded mb-4 inline-block tracking-widest">Công nghiệp Nội địa Lớn</span>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Nhà Máy Sản Xuất Nặng</h4>
                                        <p className="text-sm text-slate-600 mb-5 leading-relaxed"><strong>Nỗi đau:</strong> Hóa đơn tiền điện (OPEX) bào mòn lợi nhuận. Thiếu dòng vốn để tự đầu tư hệ thống.</p>
                                        
                                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                            <p className="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-1">Giải pháp từ 365 Energy:</p>
                                            <p className="text-sm text-slate-800 font-medium mb-3">Tư vấn cấu trúc hợp đồng DPPA, triển khai PPA và tích hợp Lưu trữ điện (BESS) cắt đỉnh giờ cao điểm.</p>
                                            <div className="pt-3 border-t border-slate-200">
                                                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                                    <strong>Bảo chứng thực tế:</strong> Vina One Steel, SC Vivo City, Asia Cold Storage.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'market_gap':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title={<EditableText id="mg_title" defaultText="Cạnh Tranh Phi Đối Xứng: Đánh Vào Điểm Yếu Cốt Lõi" isEditMode={isEditMode} tagName="span" />}
                                    subtitle={<EditableText id="mg_subtitle" defaultText="Không so sánh về giá. Bằng cách phân tích DNA tiến hóa của đối thủ, 365 Energy sẽ đánh trực diện vào những Nhu cầu chưa được thỏa mãn của khách hàng mà các tay chơi khác đang bỏ ngỏ." isEditMode={isEditMode} tagName="span" />}
                                    icon={Target}
                                    colorClass="bg-gradient-to-br from-indigo-800 to-slate-900"
                                />

                                <div className="space-y-6 mt-8">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                        <div className="md:w-5/12 bg-slate-50 p-8 md:border-r border-slate-200">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-2xl font-bold text-slate-900">Vũ Phong Energy</h3>
                                                <span className="px-2 py-1 bg-slate-200 text-slate-600 text-[9px] font-extrabold rounded uppercase tracking-widest">Top Tier Nội Địa</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">Mở rộng đa ngành (Điện mặt trời, Điện gió, R&D Robot, Asset-Co). Hệ sinh thái lớn nhưng dàn trải.</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">PPA</span>
                                                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">EPC</span>
                                                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">Robotics</span>
                                            </div>
                                        </div>
                                        <div className="md:w-7/12 p-8 flex flex-col justify-center bg-white">
                                            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Khách hàng cần gì?</p>
                                            <p className="text-sm text-slate-800 font-semibold mb-4">Sự linh hoạt, ra quyết định tài chính nhanh gọn, không vướng quy trình tập đoàn cồng kềnh.</p>
                                            
                                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                                <p className="font-bold text-emerald-800 text-xs mb-1.5 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Đối sách của 365E:</p>
                                                <p className="text-sm text-slate-700">Định vị là <strong>"Boutique EaaS Firm" (Tổ chức tinh hoa)</strong>: Focus 100% vào năng lượng C&I. "May đo" cấu trúc dòng tiền PPA linh hoạt theo từng nhà máy với tốc độ thẩm định cực nhanh.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                        <div className="md:w-5/12 bg-slate-50 p-8 md:border-r border-slate-200">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-2xl font-bold text-slate-900">Solarvest Holdings</h3>
                                                <span className="px-2 py-1 bg-slate-200 text-slate-600 text-[9px] font-extrabold rounded uppercase tracking-widest">Kỳ Lân APAC</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">Tập đoàn niêm yết Malaysia, năng lực 3.2GWp tại 8 quốc gia. Rất mạnh về FinTech và AIoT.</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">LSS/C&I</span>
                                                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">Fintech</span>
                                                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded">RECs</span>
                                            </div>
                                        </div>
                                        <div className="md:w-7/12 p-8 flex flex-col justify-center bg-white">
                                            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Khách hàng (FDI) lo sợ điều gì?</p>
                                            <p className="text-sm text-slate-800 font-semibold mb-4">Rủi ro chậm tiến độ do đối tác ngoại không am hiểu sâu sắc rào cản pháp lý & PCCC tại Việt Nam.</p>
                                            
                                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                                <p className="font-bold text-emerald-800 text-xs mb-1.5 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Đối sách của 365E:</p>
                                                <p className="text-sm text-slate-700">Dùng <strong>Năng Lực Bản Địa (Local Know-how)</strong> làm mộc khiên. Cam kết bao tiêu mượt mà thủ tục PCCC (TCVN 3890), thẩm định FM Global và tư vấn luật DPPA thông suốt.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                        <div className="md:w-5/12 bg-slate-50 p-8 md:border-r border-slate-200">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-2xl font-bold text-slate-900">SolarBK</h3>
                                                <span className="px-2 py-1 bg-slate-200 text-slate-600 text-[9px] font-extrabold rounded uppercase tracking-widest">Sản Xuất Nội Bộ</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">Đi lên từ R&D, tập trung tự chủ phần cứng với nhà máy sản xuất tấm pin (IREX) và nền tảng IoT (SSOC).</p>
                                        </div>
                                        <div className="md:w-7/12 p-8 flex flex-col justify-center bg-white">
                                            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Khách hàng cần gì?</p>
                                            <p className="text-sm text-slate-800 font-semibold mb-4">Giải pháp tối ưu hóa hiệu suất nhất, không muốn bị ép dùng vật tư "cây nhà lá vườn".</p>
                                            
                                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                                <p className="font-bold text-emerald-800 text-xs mb-1.5 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Đối sách của 365E:</p>
                                                <p className="text-sm text-slate-700">Định vị <strong>"Độc lập nền tảng" (Vendor-Neutral)</strong>. Tự do chọn lựa vật tư Tier-1 (Longi, SMA...) để cấu hình hệ thống đạt sản lượng cao nhất cho bài toán riêng của từng chủ đầu tư.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                            <span className="w-max px-2.5 py-1 bg-slate-100 text-slate-700 text-[9px] font-extrabold rounded uppercase tracking-widest mb-3">Định chế tài chính ngoại</span>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">CME Solar / BayWa r.e.</h3>
                                            <p className="text-sm text-slate-600 mb-4">Mạnh về vốn M&A nhưng thiếu đội ngũ thi công nội địa, phụ thuộc nhà thầu phụ (Outsource EPC).</p>
                                            <div className="mt-auto border-t border-slate-100 pt-4">
                                                <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">Nỗi lo của khách hàng:</p>
                                                <p className="text-sm text-slate-800 font-medium mb-3">Bị "bỏ con giữa chợ" khi hệ thống cần bảo trì (O&M).</p>
                                                <p className="text-sm text-emerald-700 font-semibold">365E chốt bằng: Bảo chứng kép (Vốn mạnh + In-house EPC quản trị 20 năm).</p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                            <span className="w-max px-2.5 py-1 bg-slate-100 text-slate-700 text-[9px] font-extrabold rounded uppercase tracking-widest mb-3">Trading & Boutique EPC</span>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Long Tech / Tona Syntegra</h3>
                                            <p className="text-sm text-slate-600 mb-4">Thế mạnh cung cấp vật tư/kỹ thuật. Tư duy đàm phán "bán thiết bị" vẫn lấn át.</p>
                                            <div className="mt-auto border-t border-slate-100 pt-4">
                                                <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">Nỗi lo của khách hàng:</p>
                                                <p className="text-sm text-slate-800 font-medium mb-3">Bị sa đà vào ma trận so sánh thông số kỹ thuật, giá linh kiện.</p>
                                                <p className="text-sm text-emerald-700 font-semibold">365E chốt bằng: Đàm phán trực tiếp với CFO về cam kết OPEX và tín chỉ CO2.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'brand_positioning':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title={<EditableText id="bp_title" defaultText="3 Kịch Bản Chiến Lược Định Vị Tương Lai 2026" isEditMode={isEditMode} tagName="span" />}
                                    subtitle={<EditableText id="bp_subtitle" defaultText="Các kịch bản được phát triển từ Tầm nhìn của 365E, nhắm thẳng vào các điểm neo trong tâm trí của từng nhóm khách hàng mục tiêu để HĐQT biểu quyết." isEditMode={isEditMode} tagName="span" />}
                                    icon={MapPin}
                                    colorClass="bg-gradient-to-br from-emerald-800 to-teal-800"
                                />

                                <div className="grid md:grid-cols-3 gap-6 mt-8 items-stretch">
                                    <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 p-8 relative flex flex-col h-full md:-translate-y-4">
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-widest shadow-md whitespace-nowrap">
                                            Lựa Chọn Tối Ưu
                                        </div>
                                        <div className="text-center mb-6 mt-4">
                                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                                <Layers className="w-8 h-8 text-emerald-600" />
                                            </div>
                                            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">The EaaS Integrator</h3>
                                            <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-widest">Nhà Tích Hợp Toàn Diện</p>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <p className="text-sm text-slate-600 mb-5 text-center leading-relaxed">Tích hợp hoàn hảo năng lực tài trợ vốn (PPA), năng lực In-house EPC và dịch vụ ESG. Định vị 365E là "Một điểm đến".</p>
                                            
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-center">
                                                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-1.5">Tuyên Ngôn Thương Hiệu</p>
                                                <p className="text-sm text-slate-800 font-semibold italic">"Chuyển đổi năng lượng không rủi ro, chịu trách nhiệm xuyên suốt từ thiết kế, nguồn vốn đến vận hành."</p>
                                            </div>
                                            <ul className="text-sm text-slate-600 space-y-3 mt-auto border-t border-slate-100 pt-4">
                                                <li className="flex items-start gap-2.5">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> 
                                                    <span><strong>Đáp ứng KH:</strong> Bao quát toàn bộ tệp FDI và Nội địa.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col h-full">
                                        <div className="text-center mb-6 mt-4">
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                                <Leaf className="w-8 h-8 text-blue-600" />
                                            </div>
                                            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Net-Zero Catalyst</h3>
                                            <p className="text-[11px] text-blue-600 font-bold uppercase tracking-widest">Đối Tác ESG Chiến Lược</p>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <p className="text-sm text-slate-600 mb-5 text-center leading-relaxed">Đưa thương hiệu <strong>365 Exergy</strong> lên tuyến đầu. Xây dựng hình ảnh Cố vấn Môi trường cao cấp, thi công chỉ là công cụ.</p>
                                            
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-center">
                                                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-1.5">Tuyên Ngôn Thương Hiệu</p>
                                                <p className="text-sm text-slate-800 font-semibold italic">"Cấp 'Giấy thông hành Xanh' giúp doanh nghiệp giữ vững vị thế trong chuỗi cung ứng toàn cầu."</p>
                                            </div>
                                            <ul className="text-sm text-slate-600 space-y-3 mt-auto border-t border-slate-100 pt-4">
                                                <li className="flex items-start gap-2.5">
                                                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" /> 
                                                    <span><strong>Đáp ứng KH:</strong> Đánh trúng nỗi đau tuân thủ CBAM/RE100 của khối FDI.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col h-full">
                                        <div className="text-center mb-6 mt-4">
                                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
                                                <PieChart className="w-8 h-8 text-amber-600" />
                                            </div>
                                            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Green Fin-Architect</h3>
                                            <p className="text-[11px] text-amber-600 font-bold uppercase tracking-widest">Kiến Tạo Tài Chính Xanh</p>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <p className="text-sm text-slate-600 mb-5 text-center leading-relaxed">Giao tiếp 100% bằng ngôn ngữ tài chính. Định vị 365E như một "Ngân hàng" tài trợ cơ sở hạ tầng (ESCO) cho nhà máy.</p>
                                            
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-center">
                                                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-1.5">Tuyên Ngôn Thương Hiệu</p>
                                                <p className="text-sm text-slate-800 font-semibold italic">"Zero-Capex. Chuyển hóa mái nhàn rỗi thành lợi nhuận OPEX tức thì."</p>
                                            </div>
                                            <ul className="text-sm text-slate-600 space-y-3 mt-auto border-t border-slate-100 pt-4">
                                                <li className="flex items-start gap-2.5">
                                                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" /> 
                                                    <span><strong>Đáp ứng KH:</strong> Thuyết phục trực diện CFO nội địa đang khát vốn, cần cắt giảm chi phí.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'profile_arch':
                        return (
                            <div className="animate-fade-in space-y-6">
                                <SectionHeader
                                    title={<EditableText id="pa_title" defaultText="Kiến Trúc Hồ Sơ Năng Lực 2026: Mô Hình Tích Hợp EaaS Toàn Diện" isEditMode={isEditMode} tagName="span" />}
                                    subtitle={<EditableText id="pa_subtitle" defaultText="Hồ sơ năng lực 2026 của 365 Energy được tái thiết kế thành một Bản Đề Xuất Giải Pháp sắc bén. Bỏ qua cách kể lể lịch sử nhàm chán, dẫn dắt đối tác đi qua 4 phân lớp giá trị cốt lõi." isEditMode={isEditMode} tagName="span" />}
                                    icon={Layers}
                                    colorClass="bg-gradient-to-br from-indigo-900 to-slate-800"
                                />

                                <div className="space-y-8 mt-8">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-10 shadow-sm">
                                            Trang 01 - 04
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">1. Thấu Hiểu Bối Cảnh (The Context)</h3>
                                        <p className="text-sm text-slate-600 mb-5 leading-relaxed">Thay thế Thư Ngỏ truyền thống bằng Tuyên ngôn của CEO về áp lực vĩ mô mà chính khách hàng đang phải gánh chịu.</p>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <p className="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-2">Mục tiêu C-Level:</p>
                                            <p className="text-sm text-slate-700 font-medium mb-3">Tạo sự đồng cảm. Chứng minh 365E thấu hiểu luật chơi DPPA, sức ép OPEX và yêu cầu chứng chỉ xanh (CBAM).</p>
                                            <div className="pt-3 border-t border-slate-200">
                                                <p className="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span><strong>Gợi ý Copywriting:</strong> "Quý vị đang đứng trước áp lực chuyển dịch kép... 365 Energy ở đây không để bán thiết bị, chúng tôi gánh vác rủi ro đầu tư và chia sẻ lợi nhuận dòng tiền cùng quý vị."</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-10 shadow-sm">
                                            Trang 05 - 10
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">2. Hệ Sinh Thái Giải Pháp (EaaS Core)</h3>
                                        <p className="text-sm text-slate-600 mb-5 leading-relaxed">Trình bày cấu trúc "One-Stop Solution" dưới dạng vòng tuần hoàn khép kín, xóa bỏ sự phân mảnh trong khâu vận hành của nhà máy.</p>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <p className="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-2">Cách thức triển khai:</p>
                                            <ul className="text-sm text-slate-700 space-y-2 mb-3">
                                                <li><strong>Tài trợ vốn:</strong> Mô hình PPA/ESCO (Zero-Capex).</li>
                                                <li><strong>Thực thi EPC:</strong> Năng lực tư vấn thiết kế & xây lắp.</li>
                                                <li><strong>Gia tăng giá trị:</strong> Cung cấp I-REC & Giải pháp BESS.</li>
                                            </ul>
                                            <div className="pt-3 border-t border-slate-200">
                                                <p className="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span><strong>Gợi ý Copywriting:</strong> "Một điểm chạm duy nhất cho mọi nhu cầu. Chúng tôi cung cấp nguồn vốn, kiến tạo hạ tầng và đảm bảo hiệu suất năng lượng 20 năm liên tục."</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-10 shadow-sm">
                                            Trang 11 - 16
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">3. Bảo Chứng Năng Lực (Trust Credentials)</h3>
                                        <p className="text-sm text-slate-600 mb-5 leading-relaxed">Đập tan nỗi lo của CFO và Giám đốc kỹ thuật bằng Data cứng. Không dùng từ ngữ cảm tính.</p>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <p className="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-2">Dữ liệu chứng minh (Facts):</p>
                                            <ul className="text-sm text-slate-700 space-y-2 mb-3">
                                                <li><strong>An toàn:</strong> Tuân thủ tuyệt đối chuẩn (PCCC), NEC. Loại bỏ nỗi sợ cháy nổ.</li>
                                                <li><strong>Quy mô:</strong> Hơn 150 dự án, 200MWp quản lý, 300MWp lắp đặt.</li>
                                                <li><strong>Tài chính:</strong> Doanh thu minh bạch 25M USD, minh chứng tiềm lực mạnh.</li>
                                            </ul>
                                            <div className="pt-3 border-t border-slate-200">
                                                <p className="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span><strong>Gợi ý Copywriting:</strong> "Sự an toàn của nhà máy là bất khả xâm phạm. Mọi thiết kế tại 365 Energy đều đi qua bộ lọc kiểm định khắt khe nhất."</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-10 shadow-sm">
                                            Trang 17 - 24+
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">4. Thực Chứng Tác Động (Impact Stories)</h3>
                                        <p className="text-sm text-slate-600 mb-5 leading-relaxed">Tuyệt đối không liệt kê danh sách dự án khô khan. Trình bày dưới dạng Case Study giải quyết vấn đề.</p>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <p className="text-[10px] text-emerald-700 uppercase font-extrabold tracking-widest mb-2">Kịch bản Case Study:</p>
                                            <ul className="text-sm text-slate-700 space-y-2 mb-3">
                                                <li><strong>Case Vina One (Ngành công nghiệp nặng):</strong> Giải bài toán định mức OPEX và tải hệ thống.</li>
                                                <li><strong>Case SC Vivo City (Thương mại):</strong> Cấu trúc PPA và O&M chuẩn Châu Âu.</li>
                                                <li><strong>Case Schindler / BAT (FDI):</strong> Chứng minh năng lực cấp vốn và tiêu chuẩn quốc tế.</li>
                                            </ul>
                                            <div className="pt-3 border-t border-slate-200">
                                                <p className="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span><strong>Gợi ý Copywriting:</strong> [Tên Dự án] - Từ bài toán ngân sách đến hệ thống phát điện [X] MWp, tiết kiệm [Y] tỷ VNĐ/năm và cắt giảm [Z] tấn Carbon.</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    default:
                        return null;
                }
            };

            return (
                <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col relative">

                    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
                        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <BrandLogo />
                                <div className="h-6 w-px bg-slate-300 hidden sm:block ml-4"></div>
                                <h1 className="text-lg font-medium text-slate-500 hidden sm:block tracking-wide ml-4">
                                    Business Intelligence Hub
                                </h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setIsEditMode(!isEditMode)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors flex items-center gap-1.5 ${isEditMode ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    <i data-lucide="edit-3" className="w-3.5 h-3.5"></i> {isEditMode ? 'Tắt Sửa Text' : 'Sửa Text'}
                                </button>
                                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase hidden sm:block">
                                    Corporate Strategy Portal
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8 flex-1 w-full">

                        <aside className="w-full md:w-[280px] shrink-0">
                            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 sticky top-24 scrollbar-hide">
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-4 hidden md:block">Kiến thức Nền tảng</div>
                                <SidebarItem icon={<BookOpen className="w-5 h-5" />} text="Tổng quan Thị trường" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                                <SidebarItem icon={<BookMarked className="w-5 h-5" />} text="Từ điển ESG & Cơ chế" active={activeTab === 'glossary'} onClick={() => setActiveTab('glossary')} />
                                <SidebarItem icon={<Cpu className="w-5 h-5" />} text="Danh mục Công nghệ" active={activeTab === 'sources'} onClick={() => setActiveTab('sources')} />

                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-4 mt-6 hidden md:block">Phân tích Cấu trúc (BI)</div>
                                <SidebarItem icon={<Target className="w-5 h-5" />} text="Thấu hiểu C&I (Insights)" active={activeTab === 'b2b'} onClick={() => setActiveTab('b2b')} />
                                <SidebarItem icon={<Globe className="w-5 h-5" />} text="Khung Tiêu chuẩn (Export)" active={activeTab === 'export'} onClick={() => setActiveTab('export')} />
                                <SidebarItem icon={<FileSearch className="w-5 h-5" />} text="Kiểm toán ESG (Audit)" active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} />
                                <SidebarItem icon={<Trophy className="w-5 h-5" />} text="Bản đồ Thương hiệu Toàn cầu" active={activeTab === 'brands'} onClick={() => setActiveTab('brands')} />
                                <SidebarItem icon={<Puzzle className="w-5 h-5" />} text="Bản đồ Dịch vụ (Service Map)" active={activeTab === 'services_map'} onClick={() => setActiveTab('services_map')} />

                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-4 mt-6 hidden md:block">Định vị Chiến lược</div>
                                <SidebarItem icon={<RefreshCw className="w-5 h-5" />} text="Hệ sinh thái (Ecosystem)" active={activeTab === 'ecosystem'} onClick={() => setActiveTab('ecosystem')} />
                                <SidebarItem icon={<Rocket className="w-5 h-5" />} text="Chiến lược 365Energy" active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} />
                                <SidebarItem icon={<Shield className="w-5 h-5" />} text="Lợi thế Cạnh tranh (USP)" active={activeTab === 'why_us'} onClick={() => setActiveTab('why_us')} />

                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-4 mt-6 hidden md:block">Chiến lược Thương hiệu 2026</div>
                                <SidebarItem icon={<Users className="w-5 h-5" />} text="Định hướng từ Khách hàng" active={activeTab === 'customer_centric'} onClick={() => setActiveTab('customer_centric')} />
                                <SidebarItem icon={<Target className="w-5 h-5" />} text="Khoảng trống Thị trường" active={activeTab === 'market_gap'} onClick={() => setActiveTab('market_gap')} />
                                <SidebarItem icon={<MapPin className="w-5 h-5" />} text="Chiến lược Định vị" active={activeTab === 'brand_positioning'} onClick={() => setActiveTab('brand_positioning')} />
                                <SidebarItem icon={<Layers className="w-5 h-5" />} text="Kiến trúc HSNL" active={activeTab === 'profile_arch'} onClick={() => setActiveTab('profile_arch')} />
                            </nav>
                        </aside>

                        <main className="flex-1 min-w-0 pb-24">
                            {renderContent()}
                            
                            {/* Khu vực Góp ý theo từng Tab */}
                            <FeedbackSection tabId={activeTab} />
                        </main>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-white p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
                            <div className="mb-4 sm:mb-0 text-center sm:text-left">
                                <h4 className="font-bold text-emerald-400 text-lg mb-1">Sẵn sàng kiến tạo lợi thế cạnh tranh?</h4>
                                <p className="text-sm text-slate-400">Trao đổi trực tiếp cùng chuyên gia chiến lược của 365Energy để thiết lập Lộ trình Net Zero.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center">
                                    <DownloadCloud className="w-4 h-4 mr-2" /> Tải Hồ sơ Năng lực
                                </button>
                                <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <PhoneCall className="w-4 h-4 mr-2" /> Đặt lịch Tư vấn 1-1
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Render Application
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);