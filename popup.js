$(document).ready(function () {
  console.log("DOM ready, attaching event listeners");

  $("#spendAmount").click(function () {
    chrome.storage.sync.get(["total", "limit"], function (budget) {
      var newTotal = 0;
      if (budget.total) {
        newTotal += parseInt(budget.total);
      }
      var amount = $("#amount").val();
      if (amount) {
        newTotal += parseInt(amount);
      }

      chrome.storage.sync.set({ total: newTotal }, function () {
        // Check if limit exists and if we've exceeded it
        if (amount && newTotal >= budget.limit) {
          var notifOptions = {
            type: "basic",
            title: "Limit Reached",
            message: "You have exceeded your budget limit of $" + budget.limit,
            iconUrl: "icon16.png",
          };
          chrome.notifications.create("limitNotif", notifOptions);
        }
      });

      $("#total").text(newTotal);
      $("#amount").val("");
    });
  });

  // Load initial total and limit on popup open
  chrome.storage.sync.get(["total", "limit"], function (budget) {
    if (budget.total) {
      $("#total").text(budget.total);
    }
    if (budget.limit) {
      $("#limit").text(budget.limit);
    }
  });

  // Open options page
  $("#openOptions").click(function () {
    chrome.runtime.openOptionsPage();
  });
});