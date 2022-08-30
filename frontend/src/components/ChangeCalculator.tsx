import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo, useState } from "react";
import { InputLine } from "../interfaces/InputLine";
import { ChangeResponseBody } from "../../../common/interfaces";
import { TFunction, useTranslation } from "react-i18next";

const SEPARATOR = ",";
const BASE_URL = "http://localhost:8000";
const DEFAULT_CURRENCY = "USD";

interface ChangeCalculatorProps {
  file: File;
  onReset: () => void;
}

export const ChangeCalculator = ({ file, onReset }: ChangeCalculatorProps) => {
  const { t } = useTranslation();
  const [outputLines, setOutputLines] = useState<string[]>([]);

  const outputFileHref = useMemo(() => {
    if (outputLines.length > 0) {
      return (
        "data:text/plain;charset=utf-8," +
        encodeURIComponent(outputLines.join("\n"))
      );
    } else {
      return "";
    }
  }, [outputLines]);

  const makeChange = useCallback(() => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result !== null) {
        const input = parseInputFile(reader.result.toString());
        const changePromises = input.map((inputLine) =>
          fetchChange(inputLine.owed, inputLine.paid)
        );
        Promise.all(changePromises)
          .then((changeResponses) => {
            const outputFileContents = createOutputContents(changeResponses, t);
            setOutputLines(outputFileContents);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.error("Error reading file.");
      }
    };

    reader.onerror = (error) => {
      console.error(error);
    };

    reader.readAsText(file);
  }, [file, setOutputLines, t]);

  return (
    <div className="component-container">
      {outputLines.length === 0 ? (
        <>
          <h3>{t("fileSelected") + " " + file.name}</h3>
          <FontAwesomeIcon icon={faFileCode} className="file-icon" />
        </>
      ) : (
        <>
          <h3>{t("yourChangeIs")}</h3>
          <div className="change-output">
            {outputLines.map((line) => (
              <p>{line}</p>
            ))}
          </div>
        </>
      )}

      <div className="button-container">
        {outputLines.length === 0 ? (
          <button className="make-change-button" onClick={makeChange}>
            {t("calculateChange")}
          </button>
        ) : (
          <a
            className="download-output-button"
            download={"output.txt"}
            href={outputFileHref}
          >
            {t("downloadOutputFile")}
          </a>
        )}

        <button className="select-another-file-button" onClick={onReset}>
          {t("selectAnotherFile")}
        </button>
      </div>
    </div>
  );
};

const parseInputFile = (fileContents: string): InputLine[] => {
  const lines = fileContents.split("\n");
  return lines
    .filter((line) => line.trim().length > 0 && line.includes(SEPARATOR))
    .map((line) => {
      const splitLine = line.split(SEPARATOR);
      const owed = parseFloat(splitLine[0]);
      const paid = parseFloat(splitLine[1]);
      return { owed, paid };
    });
};

const fetchChange = async (
  owed: number,
  paid: number
): Promise<ChangeResponseBody> => {
  const url = `${BASE_URL}/change?owed=${owed}&paid=${paid}&currency=${DEFAULT_CURRENCY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const createOutputContents = (
  responses: ChangeResponseBody[],
  t: TFunction
): string[] => {
  return responses.map((response) =>
    response.change
      .map(
        (changePortion) =>
          `${changePortion.amount} ${t(
            `currency.${DEFAULT_CURRENCY}.${changePortion.denomination.name}`,
            {
              count: changePortion.amount,
            }
          )}`
      )
      .join(SEPARATOR)
  );
};
