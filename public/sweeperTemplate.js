(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cell'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <article class=\"cell cleared\" id=\"col_"
    + alias4(((helper = (helper = helpers.x || (depth0 != null ? depth0.x : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"x","hash":{},"data":data}) : helper)))
    + "_row_"
    + alias4(((helper = (helper = helpers.y || (depth0 != null ? depth0.y : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"y","hash":{},"data":data}) : helper)))
    + "\">\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <article class=\"cell\" id=\"col_"
    + alias4(((helper = (helper = helpers.x || (depth0 != null ? depth0.x : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"x","hash":{},"data":data}) : helper)))
    + "_row_"
    + alias4(((helper = (helper = helpers.y || (depth0 != null ? depth0.y : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"y","hash":{},"data":data}) : helper)))
    + "\">\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "            <p class=\"cell-text\">\n                    "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "\n            </p>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "            <img src=\"/flag.png\">\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.cleared : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.cleared : depth0),{"name":"unless","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.flagged : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </article>\n";
},"useData":true});
})();