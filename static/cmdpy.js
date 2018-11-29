$(function () {
  $('#commandForm').submit(function () {
    let $form    = $(this),
        apiUrl   = $form.attr("action"),
        formData = $form.serialize();
    $("#commandInput").val("").focus();
    $.get(apiUrl, formData)
     .done(function (response) {
       $("#pycmdOutput")
         .append('<p class="command-input"><samp>$ ' + response.command + '</samp></p>')
         .append('<p class="command-output"><samp>' + response.result + '</samp></p>');
     })
     .fail(function (response) {
       $("#pycmdOutput")
         .append('<p class="command-input"><samp>$ ' + response.responseJSON.command + '</samp></p>')
         .append('<p class="command-error"><samp>' + response.responseJSON.result + '</samp></p>')
     });
    return false;
  });

  function availableCommands() {
    let textAvailableCommands = "";
    $.get("/api/commands/")
     .done(function (response) {
       console.log(response);
       $.each(response.commands, function (i, command) {
         textAvailableCommands += command + ", ";
       });
       $("#availableCommands").append(textAvailableCommands.substring(0, textAvailableCommands.length - 2));
     });
  }

  availableCommands();
});
