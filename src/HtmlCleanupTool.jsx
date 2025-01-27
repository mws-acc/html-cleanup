import React, { useState } from "react";

const HtmlCleanupTool = () => {
  const [htmlFile, setHtmlFile] = useState(null);
  const [filteredHtml, setFilteredHtml] = useState("");
  const [filterKeywords, setFilterKeywords] = useState(
    "Demo|Beta|v1|Official|Action Replay|Baseball|Exhibition|Starter|College|Bonus|Gameshark|GamePro|DVD|Arcade|Jampack|ESPN|Sports|FIFA|Proto|Football|Fight|Music|Prix|Karaoke|Kiosk|Dance|Dancing|Horse|Hack|Bowling|Golf|PGA|Capcom|Classics|Collection|Atari|Pack|Hunt|Madden|MLB|NCAA|NFL|NBA|Nascar|Soccer|NHL|Formula|F1|(Japan)|Dreamworks|Disney|Kids|(Demo)|Racer|Racing|Barbie|Bratz|Indianapolis|WWE|WCW|Wrestling|UFC|ball|Online|Nick|Pinball|Puzzle"
  );
  const replaceStrings =
    "\\s?\\(USA, Europe\\)|\\s?\\(Unl\\)|\\s?\\(USA, Australia\\)|\\s?\\(USA, Japan\\)|\\s?\\(USA, Asia\\)|\\s?\\(USA\\)|\\s?\\.zip|\\s?\\(2004\\-01\\-15\\)|\\s?\\(Asia\\)|\\s?\\(Australia\\)|\\s?\\(Austria, Switzerland\\)|\\s?\\(Build 5659\\)|\\s?\\(De,Es\\)|\\s?\\(De,Nl\\)|\\s?\\(En,De\\)|\\s?\\(En,De,Es,It,Nl\\)|\\s?\\(En,De,It\\)|\\s?\\(En,Es\\)|\\s?\\(En,Es,It\\)|\\s?\\(En,Es,It,Nl,Sv\\)|\\s?\\(En,Es,Nl,Sv\\)|\\s?\\(En,Fr\\)|\\s?\\(En,Fr,De\\)|\\s?\\(En,Fr,De,Es\\)|\\s?\\(En,Fr,De,Es,It\\)|\\s?\\(En,Fr,De,Es,It,Da\\)|\\s?\\(En,Fr,De,Es,It,Ko\\)|\\s?\\(En,Fr,De,Es,It,Nl\\)|\\s?\\(En,Fr,De,Es,It,Nl,Da\\)|\\s?\\(En,Fr,De,Es,It,Nl,Sv\\)|\\s?\\(En,Fr,De,Es,It,Nl,Sv,No,Da,Fi\\)|\\s?\\(En,Fr,De,Es,It,Pt\\)|\\s?\\(En,Fr,De,Es,Nl,Sv,No,Fi\\)|\\s?\\(En,Fr,De,It\\)|\\s?\\(En,Fr,De,It,Nl,Sv\\)|\\s?\\(En,Fr,De,It,Pt\\)|\\s?\\(En,Fr,De,Zh,Ko\\)|\\s?\\(En,Fr,Es\\)|\\s?\\(En,Fr,Es,It\\)|\\s?\\(En,Fr,Es,It,Ko\\)|\\s?\\(En,Fr,Es,It,Pt\\)|\\s?\\(En,Fr,It\\)|\\s?\\(En,Fr,Pt\\)|\\s?\\(En,It\\)|\\s?\\(En,It,Nl,Sv\\)|\\s?\\(En,Ja\\)|\\s?\\(En,Ja,Fr,De\\)|\\s?\\(En,Ja,Fr,De,Es,It\\)|\\s?\\(En,Ja,Fr,De,Es,It,Zh,Ko\\)|\\s?\\(En,Ja,Ko\\)|\\s?\\(En,Ja,Zh\\)|\\s?\\(En,Ko\\)|\\s?\\(En,Nl\\)|\\s?\\(En,Nl,Sv\\)|\\s?\\(En,Nl,Sv,Da\\)|\\s?\\(En,Nl,Sv,No,Fi\\)|\\s?\\(En,Sv\\)|\\s?\\(En,Zh\\)|\\s?\\(En,Zh,Ko\\)|\\s?\\(Es,It\\)|\\s?\\(Es,It,Nl,Sv,Da,Fi\\)|\\s?\\(Europe\\)|\\s?\\(Europe, Australia\\)|\\s?\\(Fr,De\\)|\\s?\\(Fr,De,Es\\)|\\s?\\(Fr,De,Es,It\\)|\\s?\\(Fr,De,It\\)|\\s?\\(Fr,Es\\)|\\s?\\(Fr,Es,It\\)|\\s?\\(Fr,Es,It,Pt\\)|\\s?\\(Fr,It\\)|\\s?\\(France\\)|\\s?\\(Germany\\)|\\s?\\(Italy\\)|\\s?\\(Korea\\)|\\s?\\(Multiplayer Alpha\\)|\\s?\\(Netherlands\\)|\\s?\\(Spain\\)|\\s?\\(Sweden\\)|\\s?\\(Taiwan\\)|\\s?\\(UK\\)|\\s?\\(UK, Australia\\)|\\s?\\(USA, Korea\\)|\\s?\\(World\\)|\\s?\\(_\\)";

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setHtmlFile(e.target.result);
    };

    reader.readAsText(file);
  };

  const cleanHtml = () => {
    if (!htmlFile) return;

    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlFile, "text/html");

    // Iterate over rows and filter based on keywords
    let rows = doc.querySelectorAll("tr");
    rows.forEach((row) => {
      const rowText = row.textContent || "";

      // Remove row if it contains filter keywords
      const regexFilter = new RegExp(filterKeywords, "i");
      if (regexFilter.test(rowText)) {
        row.remove();
        return;
      }

      // Process anchor tags within the row
      let anchors = row.querySelectorAll("a");
      anchors.forEach((anchor) => {
        const originalTitle = anchor.getAttribute("title") || "";
        const regexReplace = new RegExp(replaceStrings, "g");

        // Replace matched strings in the title
        let updatedTitle = originalTitle
          .replace(regexReplace, "")
          .replace(/\(\s*[,.]*\s*\)/g, "") // Clean empty parentheses and commas
          .trim();
        anchor.setAttribute("title", updatedTitle);

        // Update the visible text similarly
        if (anchor.textContent) {
          let updatedText = anchor.textContent
            .replace(regexReplace, "")
            .replace(/\(\s*[,.]*\s*\)/g, "")
            .trim();
          anchor.textContent = updatedText;
        }
      });
    });

    setFilteredHtml(doc.documentElement.outerHTML);
  };

  const downloadCleanedFile = () => {
    if (!filteredHtml) {
      alert(
        "No cleaned HTML available for download. Please clean the HTML first."
      );
      return;
    }
    const blob = new Blob([filteredHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cleaned.html";
    document.body.appendChild(link); // Append link to the body
    link.click();
    document.body.removeChild(link); // Remove link after downloading
  };

  return (
    <div className="p-4">
      <div className="card">
        <div className="card-content">
          <h1 className="text-xl font-bold mb-4">HTML Cleanup Tool</h1>
          <input
            type="file"
            accept=".html"
            onChange={handleFileUpload}
            className="mb-4"
          />
          <div className="mb-4">
            <label className="block font-bold mb-2">
              Filter Keywords (Pipe-separated):
            </label>
            <input
              value={filterKeywords}
              onChange={(e) => setFilterKeywords(e.target.value)}
              placeholder="Enter keywords (e.g., Demo|Beta)"
              className="input"
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">
              Strings to Replace (Regex):
            </label>
            <input
              value={replaceStrings}
              onChange={(e) => setReplaceStrings(e.target.value)}
              placeholder="Enter strings to replace"
              className="input"
            />
          </div>
          <button onClick={cleanHtml} className="btn mr-2">
            Clean HTML
          </button>
          {filteredHtml && (
            <button onClick={downloadCleanedFile} className="btn ml-2">
              Download Cleaned File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HtmlCleanupTool;
