import "../styles/ChangeCalculator.scss";
import { useCallback, useMemo, useState } from "react";
import { TFunction, useTranslation } from "react-i18next";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputLine } from "../interfaces/InputLine";
import { ChangeResponseBody } from "../../../common/interfaces";

const SEPARATOR = ",";
const BASE_URL = "http://localhost:8000";
const DEFAULT_CURRENCY = "USD";

const NO_ERROR = "";
const FILE_ERROR_MESSAGE = "fileErrorMessage";
const NETWORK_ERROR_MESSAGE = "networkErrorMessage";

interface ChangeCalculatorProps {
  file: File;
  onReset: () => void;
}

export const ChangeCalculator = ({ file, onReset }: ChangeCalculatorProps) => {
  const { t } = useTranslation();
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState(NO_ERROR);

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
    setErrorMessage(NO_ERROR);
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result !== null) {
        try {
          const input = parseInputFile(reader.result.toString());
          const changePromises = input.map((inputLine) =>
            fetchChange(inputLine.owed, inputLine.paid)
          );
          Promise.all(changePromises)
            .then((changeResponses) => {
              const outputFileContents = createOutputContents(
                changeResponses,
                t
              );
              setOutputLines(outputFileContents);
            })
            .catch((error) => {
              setErrorMessage(NETWORK_ERROR_MESSAGE);
              console.error(error);
            });
        } catch (error) {
          setErrorMessage(FILE_ERROR_MESSAGE);
        }
      } else {
        setErrorMessage(FILE_ERROR_MESSAGE);
        console.error("Error reading file.");
      }
    };

    reader.onerror = (error) => {
      setErrorMessage(FILE_ERROR_MESSAGE);
      console.error(error);
    };

    reader.readAsText(file);
  }, [file, setOutputLines, t, setErrorMessage]);

  return (
    <div className="component-container">
      {errorMessage !== NO_ERROR && (
        <div className="error-message">{t(errorMessage)}</div>
      )}
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
              <p key={line}>{line}</p>
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
  try {
    const lines = fileContents.split("\n");
    return lines
      .filter((line) => line.trim().length > 0 && line.includes(SEPARATOR))
      .map((line, index) => {
        const splitLine = line.split(SEPARATOR);
        const owed = parseFloat(splitLine[0]);
        const paid = parseFloat(splitLine[1]);

        if (isNaN(owed) || isNaN(paid)) {
          throw new Error(
            `Error: could not parse line ${index} of input file.`
          );
        }
        return { owed, paid };
      });
  } catch (error) {
    console.error(error);
    throw error;
  }
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
