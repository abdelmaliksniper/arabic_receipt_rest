# -*- coding: utf-8 -*-
{
    'name': "Arabic Restaurant and Kitchen Receipt",

    'summary': """ This module enables arabic printing for Restaurant and Kitchen receipt from Right to Left (RTL) Using PosBox.
        """,

    'description': """
        
    """,

    'author': "Abdelmalik Yousif",
    'website': "abdelmalik19930@gmail.com",
    'category': 'Generic Modules',
    'version': '1.0',
    'price': 399.0,
    'currency': 'EUR',
    'depends': ['pos_restaurant', 'point_of_sale'],


    'data': [
        'views/malik.xml',
        'views/malik_v.xml',
    ],

    'demo': [
        #'demo/demo.xml',
    ],
    'qweb': [
        'static/src/xml/pos.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
