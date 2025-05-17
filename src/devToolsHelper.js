import readline from "readline";

export async function waitForUserInput(
  message = "Presioná ENTER para continuar..."
) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(`${message}\n`, () => {
      rl.close();
      resolve();
    })
  );
}
