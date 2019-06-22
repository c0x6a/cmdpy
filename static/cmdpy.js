document.addEventListener("DOMContentLoaded", _ => {
  const form = document.getElementById("commandForm");
  const input = document.getElementById("commandInput");
  const output = document.getElementById("pycmdOutput");
  const commands = document.getElementById("availableCommands");

  const handleErrors = response => {
    if (response.status === 403) {
      throw Error("You're not allowed to use this command.");
    }
    if (!response.ok) {
      throw Error("The request wasn't succesful.");
    }
    return response;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    fetch("/api/cmd", {
      body: JSON.stringify({
        "cmd": input.value
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleErrors)
      .then(res => res.json())
      .then(res => {
        output.innerHTML += `<p class="command-input"><samp>$ ${res.command}</samp></p>`;
        output.innerHTML += `<p class="command-output"><samp>${res.result}</samp></p>`;
      })
      .catch(err => {
        output.innerHTML += `<p class="command-error"><samp>${err.message}</samp></p>`;
      });
    
    input.value = "";
    input.focus();
  });

  fetch("/api/commands")
    .then(handleErrors)
    .then(res => res.json())
    .then(body => {
      body.commands.forEach(elm => {
        commands.textContent += `${elm}, `
      });
      commands.textContent = commands.textContent.slice(0, -2);
    })
    .catch(err => {
      commands.textContent = err;
    });
});
