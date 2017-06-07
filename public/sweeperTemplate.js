(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cell'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "\n<article class=\"cell\">\n        <p class=\"cell-text\">\n            "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "\n        </p>\n</article>\n";
},"useData":true});
})();