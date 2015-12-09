var utils = require('../lib/utils');

hexo.extend.generator.register('post', function (locals) {
  var self = this;

  var routes = [];
  function addRoute (path, data, layout) {
    routes.push({
      path: path,
      data: data,
      layout: layout
    });
  }

  addRoute('guide/', utils.createRedirectResponse(hexo, 'guide/getting-started/'));

  if (locals.data.examples) {
    var examples = {};
    var examplesRedirect = utils.createRedirectResponse(hexo, 'examples/');

    Object.keys(locals.data.examples).map(function (sectionSlug) {
      var section = locals.data.examples[sectionSlug];

      // TODO: Eventually build out separate pages for each category in Examples.
      addRoute('examples/' + sectionSlug + '/', examplesRedirect);

      section.examples.forEach(function (example) {
        var permalink = utils.urljoin('examples', sectionSlug, example.slug, '/');
        example.type = 'examples';
        example.section = sectionSlug;
        example.url = permalink;
        example.is_external = utils.isUrl(example.path);
        addRoute(permalink, example, 'example');
        examples[permalink] = example;
        if (!self.config.examples) { return; }
        if (permalink === self.config.examples.first_example_url) {
          addRoute('examples/', example, 'example');
        }
        if (permalink === self.config.examples.homepage_example_url) {
          addRoute('/', example, 'index');
        }
      });
    });
    hexo.locals.set('examples_by_urls', function () {
      return examples;
    });
  }

  return routes;
});
