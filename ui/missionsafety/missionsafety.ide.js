TW.IDE.Widgets.missionsafety = function () {
  this.widgetIconUrl = function () {
    return "'../Common/extensions/missionsafety/ui/missionsafety/default_widget_icon.ide.png'";
  };

  this.widgetProperties = function () {
    return {
      name: "Mission Safety Sample",
      description: "",
      category: ["Common"],
      isContainer: true,
      supportsAutoResize: true,
      properties: {
        SeaState: {
          name: "SeaState",
          baseType: "STATEDEFINITION",
          defaultValue: "DefaultSeaState",
        },
        ShipState: {
          name: "ShipState",
          baseType: "STATEDEFINITION",
          defaultValue: "DefaultShipState",
        },
        SailingState: {
          name: "SailingState",
          baseType: "STATEDEFINITION",
          defaultValue: "DefaultSailingState",
        },
        Datas: {
          name: "Datas",
          baseType: "JSON",
          isBindingTarget: true,
        },
      },
    };
  };

  this.validate = function () {
    const result = [];

    if (this.isPropertyBoundAsTarget("Data")) {
      if (
        this.getProperty("IDField") === undefined ||
        this.getProperty("IDField").length === 0
      ) {
        result.push({
          severity: "warning",
          message: TW.IDE.I18NController.translate(
            "tw.tree-ide.id-field-required"
          ),
        });
      }
      if (
        this.getProperty("ParentIDField") === undefined ||
        this.getProperty("ParentIDField").length === 0
      ) {
        result.push({
          severity: "warning",
          message: TW.IDE.I18NController.translate(
            "tw.tree-ide.parent-id-field-required"
          ),
        });
      }
    }

    return result;
  };

  this.afterSetProperty = function (name, value) {
    console.log(name, value);
    let refreshHtml = false;
    switch (name) {
      case "SeaState":
      case "ShipState":
      case "SailingState":
        refreshHtml = value ? true : false;
        break;
    }
    return refreshHtml;
  };

  this.renderHtml = function () {
    return `
	<div class='widget-content widget-missionsafety'>
		<div id="${this.getProperty(
      "Id"
    )}" class="container" style="width:100%;height:100%"></div>
	</div>
	`;
  };

  this.afterRender = async function () {
    const id = this.getProperty("Id");
    //let charts = await getHighcharts();

    const subtitleText = getSubtitle(this.getProperty("SailingState"));
    const seriesState = getSeriesState(this.getProperty("SeaState"));
    const shipState = getShipState(this.getProperty("ShipState"));

    chart.subtitle.text = subtitleText;
    chart.series = seriesState;
    chart.series.push(shipState);

    Highcharts.chart(id, chart);
  };
};
