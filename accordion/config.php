<?php

$config =  array(
	'defaults' => array(
		'widgetFolder' => 'accordion', // Widget folder name.
		'widgetName' => 'Accordion', // One or two word name for widget.
		'widgetType' => 'Content', // Header, Content, Footer, All.
		'moduleConnection' => '', // Which, if any, modules .does the widget use.
	),
	'includes' => array(
		'js' => array( // any non-global includes
			'1' => '',
			),
		'css' => array( // any non-global includes
			'1' => '',
			),
		),
		
	'config' => array(
            'inputs' => array(
                    array(
                        'type' => 'select',
                        'label' => 'Select Styles',
                        'value' => array('Red'=>'0','Green'=>'1','Blue'=>'2')
                    ),
                    array(
                        'type' => 'radio',
                        'label' => 'Vertical',
                        'groupname' => 'acrdon',
                        'value' => '0'
                    ),
                    array(
                            'type' => 'radio',
                            'label' => 'Horizontal',
                            'groupname' => 'acrdon',
                            'value' => '1'
                        ),
                    array(
                            'type' => 'text',
                            'label' => 'No of Accordions',
                            'value' => '5'
                        ),
                    array(
                            'type' => 'a',
                            'label' => 'Help',
                            'href' => 'http://www.google.com',
                            'target' => '_blank'
                        ),
                    array(
                            'type' => 'color',
                            'label' => 'Background Color : ',
                            'value' => ''
                        )
                )
            )
); 

$ajaxReturn = $_REQUEST["ajaxReturn"];
if($ajaxReturn)
    echo json_encode($config);
else
    return $config;