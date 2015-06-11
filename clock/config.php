<?php
$ajaxReturn = $_REQUEST["ajaxReturn"];
$config =  array(
	'defaults' => array(
		'widgetFolder' => 'clock', // Widget folder name.
		'widgetName' => 'Clock', // One or two word name for widget.
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
                        'label' => 'Time Format :',
                        'value' => array('24h format'=>0,'12h format'=>1,'Long format'=>2)
                    ),
                    array(
                        'type' => 'checkbox',
                        'label' => 'Show Seconds :',
                        'value' => array('')
                    )
                )
            )
); 

if($ajaxReturn)
    echo json_encode($config);
else
    return $config;