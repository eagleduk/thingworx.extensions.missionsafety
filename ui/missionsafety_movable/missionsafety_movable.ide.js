TW.IDE.Widgets.missionsafety_movable = function () {

	this.widgetIconUrl = function() {
		return  "'../Common/extensions/missionsafety/ui/missionsafety_movable/default_widget_icon.ide.png'";
	};

	this.widgetProperties = function () {
		return {
			'name': 'missionsafety movable',
			'description': '',
			'category': ['Common'],
			'properties': {
				'missionsafety movable Property': {
					'baseType': 'STRING',
					'defaultValue': 'missionsafety movable Property default value',
					'isBindingTarget': true
				}
			}
		}
	};

	this.afterSetProperty = function (name, value) {
		var thisWidget = this;
		var refreshHtml = false;
		switch (name) {
			case 'Style':
			case 'missionsafety movable Property':
				thisWidget.jqElement.find('.missionsafety-movable-property').text(value);
			case 'Alignment':
				refreshHtml = true;
				break;
			default:
				break;
		}
		return refreshHtml;
	};

	this.renderHtml = function () {
		// return any HTML you want rendered for your widget
		// If you want it to change depending on properties that the user
		// has set, you can use this.getProperty(propertyName).
		return 	'<div class="widget-content widget-missionsafety_movable">' +
					'<span class="missionsafety-movable-property">' + this.getProperty('missionsafety movable Property') + '</span>' +
				'</div>';
	};

	this.afterRender = function () {
		// NOTE: this.jqElement is the jquery reference to your html dom element
		// 		 that was returned in renderHtml()

		// get a reference to the value element
		valueElem = this.jqElement.find('.missionsafety-movable-property');
		// update that DOM element based on the property value that the user set
		// in the mashup builder
		valueElem.text(this.getProperty('missionsafety movable Property'));
	};

};