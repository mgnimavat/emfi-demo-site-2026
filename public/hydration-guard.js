(function () {
  function isExtensionNoise(filename, stack, message) {
    var source = [filename || "", stack || "", message || ""].join("\n");
    return source.indexOf("chrome-extension://") !== -1 || source.indexOf("moz-extension://") !== -1 || source.indexOf("safari-extension://") !== -1;
  }

  window.addEventListener("error", function (event) {
    var stack = event.error && event.error.stack;
    if (!isExtensionNoise(event.filename, stack, event.message)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    var stack = reason && reason.stack;
    var message = reason && reason.message;
    if (!isExtensionNoise("", stack, message || String(reason || ""))) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  var ATTRS = ["bis_skin_checked", "bis_register"];

  function strip(node) {
    if (!node || node.nodeType !== 1 || !node.removeAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      if (node.hasAttribute(ATTRS[i])) node.removeAttribute(ATTRS[i]);
    }
  }

  function sweep(root) {
    strip(root);
    if (!root || !root.querySelectorAll) return;
    var nodes = root.querySelectorAll("[" + ATTRS.join("],[") + "]");
    for (var i = 0; i < nodes.length; i++) strip(nodes[i]);
  }

  sweep(document.documentElement);

  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      if (record.type === "attributes") strip(record.target);
      var added = record.addedNodes;
      for (var j = 0; j < added.length; j++) sweep(added[j]);
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ATTRS,
  });

  setTimeout(function () {
    observer.disconnect();
  }, 4000);
})();
