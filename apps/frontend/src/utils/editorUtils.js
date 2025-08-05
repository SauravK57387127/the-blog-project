export function withEditorCommand(editor, commandFn, isAllowed = () => true) {
    return (event) => {
        event.preventDefault();
        if (!isAllowed(editor)) return;

        const command = commandFn(editor);
        if (command) command.run();
    };
}

// onMouseDown={
//   // Step 1: React passes `e` when mouseDown happens
//   // You gave React this function:
//   withEditorCommand(editor, commandFn, isAllowed)

//   // Step 2: That function returned a new function (like: (e) => { ... })

//   // Step 3: React calls that returned function with the event `e`

//   // So now:
//   // - You didn't give `e` yourself
//   // - React gave it when it fired the mouseDown event
// }

// ou’re not using e in the outer function → no problem

// You return a function that defines e

// React provides e at runtime when the event occurs

// This is how all higher-order event handlers work in React/JS
