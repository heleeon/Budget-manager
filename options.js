$(document).ready(function () {
  console.log("Options page loaded");

  // Load current limit when options page opens
  chrome.storage.sync.get("limit", function (budget) {
    if (budget.limit) {
      $("#limit").val(budget.limit);
    }
  });

  // Save limit button
  $("#saveLimit").click(function () {
    var limit = $("#limit").val();
    if (limit) {
      chrome.storage.sync.set({ limit: limit }, function () {
        showStatus("Budget limit saved successfully!", "success");
      });
    }
  });

  // Reset total button
  $("#resetTotal").click(function () {
    chrome.storage.sync.set({ total: 0 }, function () {
      showStatus("Total has been reset to 0!", "success");
    });
  });

  // Function to show status messages
  function showStatus(message, type) {
    var status = $("#status");
    status.text(message);

    // Set styling based on message type
    if (type === "success") {
      status.css({
        "background-color": "#d4edda",
        color: "#155724",
        border: "1px solid #c3e6cb",
      });
    } else if (type === "error") {
      status.css({
        "background-color": "#f8d7da",
        color: "#721c24",
        border: "1px solid #f5c6cb",
      });
    } else if (type === "warning") {
      status.css({
        "background-color": "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeaa7",
      });
    }

    status.show();

    // Hide the message after 3 seconds
    setTimeout(function () {
      status.fadeOut();
    }, 3000);
  }
});