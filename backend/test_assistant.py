import httpx

tests = [
    {
        'role': 'Farmer',
        'page': 'AI Crop Doctor',
        'tab': 'farmer_crop_doctor',
        'msg': 'என் தக்காளி செடியில் இலை மஞ்சளாகுது, என்ன செய்ய வேண்டும்?',
        'lang': 'ta'
    },
    {
        'role': 'Retailer',
        'page': 'Store Products',
        'tab': 'products',
        'msg': 'Hamare stock me kaunsa fertilizer kam hai?',
        'lang': 'hi'
    },
    {
        'role': 'Distributor',
        'page': 'Route & Fleet Logistics',
        'tab': 'map',
        'msg': 'Can you check if there are delayed fleet shipments on the Thanjavur route?',
        'lang': 'en'
    },
    {
        'role': 'Farmer',
        'page': 'Dashboard',
        'tab': 'dashboard',
        'msg': 'Explain what GST is simply in 2 lines.',
        'lang': 'en'
    }
]

for t in tests:
    try:
        r = httpx.post(
            'http://localhost:8000/api/assistant/chat',
            json={
                'message': t['msg'],
                'user_role': t['role'],
                'current_page': t['page'],
                'current_tab': t['tab'],
                'language': t['lang'],
                'page_context': {'active_transfers': 4, 'depots': 12, 'crop': 'Tomato'}
            },
            timeout=25
        )
        data = r.json()
        print('=== Role:', t['role'], '| Page:', t['page'], '===')
        print('Status:', r.status_code)
        print('Model:', data.get('model_used'))
        print('Detected lang:', data.get('detected_language'))
        print('Action:', data.get('action'))
        reply = data.get('reply', '')
        print('Reply snippet length:', len(reply))
    except Exception as e:
        print('Error in', t['role'], ':', e)
