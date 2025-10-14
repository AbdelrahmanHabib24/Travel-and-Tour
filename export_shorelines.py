from coastsat import SDS_download, SDS_preprocess, SDS_shoreline

# ⚙️ إعداد المنطقة (بالإحداثيات التقريبية أو الاسم)
inputs = {
    'polygon': [[30.000, 31.000], [30.000, 31.010], [30.010, 31.010], [30.010, 31.000]],
    'sat_list': ['L5', 'L7', 'L8', 'L9'],
    'cloud_thresh': 0.5,
    'dist_clouds': 300,
    'output_epsg': 32636,  # UTM zone (حسب منطقتك)
}

# 🗓️ حدد السنوات المطلوبة
years = [2000, 2015, 2025]

for year in years:
    print(f"\n🌊 Processing shoreline for {year}...")
    
    # تحديد فترة كل سنة
    inputs['dates'] = [f'{year}-01-01', f'{year}-12-31']
    
    # 1. تحميل الصور
    metadata = SDS_download.retrieve_images(inputs)
    
    # 2. معالجة الصور
    inputs['filepath'] = metadata['filepath']
    preprocessed = SDS_preprocess.preprocess_single(inputs, metadata)
    
    # 3. استخراج خط الساحل
    shorelines = SDS_shoreline.extract_shorelines(inputs, preprocessed)
    
    print(f"✅ Done for {year} — Results saved in {inputs['output_epsg']}")
