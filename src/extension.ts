import * as vscode from "vscode";

function pxToRem(px: string) {
  const pxPerRem = parseInt(
    vscode.workspace
      .getConfiguration()
      .get("pxRemConverter.pxPerRem") as string,
    10
  );

  const value = parseInt(px, 10);
  const result = value / pxPerRem;

  return result + "rem";
}

function convert(input: string) {
  const pxRegex = /\d+(\.\d+)?px/;

  let result = input;

  const matches = input.match(pxRegex);

  if (!matches) {
    vscode.window.showErrorMessage("Could not find a pixel value.");

    return input;
  }

  matches.forEach(match => {
    result = result.replace(match, pxToRem(match));
  });

  return result;
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerTextEditorCommand(
    "extension.convert",
    (editor, edit) => {
      let selections: vscode.Selection[];

      if (editor.selection.isEmpty) {
        const active = editor.selection.active;

        selections = [
          new vscode.Selection(
            active.with(undefined, 0),
            active.with(undefined, Infinity)
          )
        ];
      } else {
        selections = editor.selections;
      }

      selections.forEach(selection => {
        const result = convert(editor.document.getText(selection));
        edit.replace(selection, result);
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
