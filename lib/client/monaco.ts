/**
 * Copyright (C) 2021 tt.bot dev team
 * 
 * This file is part of @tt-bot-dev/web.
 * 
 * @tt-bot-dev/web is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * @tt-bot-dev/web is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with @tt-bot-dev/web.  If not, see <http://www.gnu.org/licenses/>.
 */

import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
import "monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js";
// import "monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js";
// import "monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js";
import "monaco-editor/esm/vs/editor/contrib/anchorSelect/anchorSelect.js";
import "monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js";
import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
import "monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions.js";
import "monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js";
// import "monaco-editor/esm/vs/editor/contrib/colorPicker/colorDetector.js";
import "monaco-editor/esm/vs/editor/contrib/comment/comment.js";
import "monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js";
import "monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js";
import "monaco-editor/esm/vs/editor/contrib/dnd/dnd.js";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
import "monaco-editor/esm/vs/editor/contrib/folding/folding.js";
import "monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom.js";
import "monaco-editor/esm/vs/editor/contrib/format/formatActions.js";
import "monaco-editor/esm/vs/editor/contrib/gotoError/gotoError.js";
import "monaco-editor/esm/vs/editor/contrib/gotoSymbol/goToCommands.js";
import "monaco-editor/esm/vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition.js";
import "monaco-editor/esm/vs/editor/contrib/hover/hover.js";
import "monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace.js";
import "monaco-editor/esm/vs/editor/contrib/indentation/indentation.js";
import "monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js";
import "monaco-editor/esm/vs/editor/contrib/links/links.js";
// import "monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js";
import "monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js";
import "monaco-editor/esm/vs/editor/contrib/rename/rename.js";
import "monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js";
// import "monaco-editor/esm/vs/editor/contrib/snippet/snippetController2.js";
import "monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js";
import "monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode.js";
import "monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/unusualLineTerminators.js";
import "monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/viewportSemanticTokens.js";
import "monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js";
import "monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js";
import "monaco-editor/esm/vs/editor/contrib/wordPartOperations/wordPartOperations.js";
import "monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js";
import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js";
import "monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js";

export * from "monaco-editor/esm/vs/editor/editor.api.js";

// import "monaco-editor/esm/vs/language/css/monaco.contribution.js";
// import "monaco-editor/esm/vs/language/html/monaco.contribution.js";
// import "monaco-editor/esm/vs/language/json/monaco.contribution.js";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/abap/abap.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/apex/apex.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/azcli/azcli.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/bat/bat.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/cameligo/cameligo.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/clojure/clojure.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/coffee/coffee.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/csp/csp.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/css/css.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/dart/dart.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/fsharp/fsharp.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/go/go.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/graphql/graphql.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/handlebars/handlebars.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/hcl/hcl.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/html/html.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/ini/ini.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/java/java.contribution.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/julia/julia.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/kotlin/kotlin.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/less/less.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/lexon/lexon.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/lua/lua.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/mips/mips.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/msdax/msdax.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/mysql/mysql.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/objective-c/objective-c.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/pascal/pascal.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/pascaligo/pascaligo.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/perl/perl.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/pgsql/pgsql.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/php/php.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/postiats/postiats.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/powerquery/powerquery.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/powershell/powershell.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/pug/pug.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/python/python.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/r/r.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/razor/razor.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/redis/redis.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/redshift/redshift.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/restructuredtext/restructuredtext.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/rust/rust.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/sb/sb.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/scala/scala.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/scheme/scheme.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/scss/scss.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/shell/shell.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/solidity/solidity.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/sophia/sophia.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/st/st.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/swift/swift.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/systemverilog/systemverilog.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/tcl/tcl.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/twig/twig.contribution.js";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/vb/vb.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/xml/xml.contribution.js";
// import "monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js";


//@ts-expect-error: MonacoEnvironment is being assigned to its proper value
globalThis.MonacoEnvironment = {
    getWorker(_: unknown, label: string): Worker {
        if (label === "typescript" || label === "javascript") {
            //@ts-expect-error: import.meta is supported by Parcel
            return new Worker(new URL("monacoTsWorker.js", import.meta.url), {
                type: "module"
            });
        }
        //@ts-expect-error: import.meta is supported by Parcel
        return new Worker(new URL("monacoEditorWorker.js", import.meta.url), {
            type: "module"
        });
    }
};
