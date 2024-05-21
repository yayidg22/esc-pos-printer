class Printer {
  private results: PrinterActions[];
  private printerName: string;
  private textSpecial: boolean;
  private textAsian: boolean;
  private key?: string;

  constructor(
    printerName?: string,
    config?: { textAsian?: boolean; textSpecial?: boolean; key?: string }
  ) {
    this.printerName = printerName ?? "";
    this.textSpecial = config?.textSpecial ?? false;
    this.textAsian = config?.textAsian ?? false;
    this.key = config?.key;
    this.results = [];
  }

  public setPrinterName(printerName: string): void {
    this.printerName = printerName;
  }

  /**
   *  add the key to remove watermark
   */
  public setKey(key: string): void {
    this.key = key;
  }

  /**
   * for more compatibility with asian characters compatible with some printers
   */
  public setPrinterTextAsian(value: boolean): void {
    this.textAsian = value;
  }

  /**
   * the text rendered of this print instance is going to be printed as unicode
   */
  public setPrinterTextSpecial(value: boolean): void {
    this.textSpecial = value;
  }

  // Method to select print mode based on the mode string
  public selectPrintMode(mode?: PrinterModes): void {
    this.results.push({
      type: PrinterActionsTypes.selectPrintMode,
      payload: mode ?? undefined,
    });
  }

  /**
   * The `justifyCenter` function in TypeScript adds a command to the `results` array to center justify
   * text when printing.
   */
  public justify(mode: JustifyModes): void {
    this.results.push({
      type: PrinterActionsTypes.justify,
      payload: mode,
    });
  }

  /**
   * The function `printBase64Image` adds a print action with a base64 image payload to a results array.
   * @param {string} imageBase64 - The `imageBase64` parameter in the `printBase64Image` function is a
   * string that represents an image encoded in Base64 format. This string contains the image data in a
   * format that can be easily transmitted and displayed.
   * @param {PrinterImagesModes} imageMode the imageMode (size)
   */
  public printBase64Image(
    imageBase64: string,
    imageMode?: PrinterImagesModes
  ): void {
    this.results.push({
      type: PrinterActionsTypes.printBase64Image,
      payload: imageBase64,
      extraData: imageMode ?? PrinterImagesModes.IMG_DEFAULT,
    });
  }

  /**
   * The `text` function in TypeScript adds a text payload to an array of results.
   * @param {string} text - The `text` parameter in the `public text(text: string): void` function is a
   * string type parameter. This function takes a string input and pushes an object with the type
   * `PrinterActionsTypes.text` and the `text` payload into the `results` array.
   */
  public text(text: string): void {
    this.results.push({
      type: this.textAsian
        ? PrinterActionsTypes.textAsian
        : PrinterActionsTypes.text,
      payload: text,
    });
  }

  /**
   *@param {string} value the value to print "ABC"
   *@param {BarcodeModes} mode barcode mode "BARCODE_CODE39" DEFAULT
   */
  public barcode(value: string, mode?: BarcodeModes): void {
    this.results.push({
      type: PrinterActionsTypes.barcode,
      payload: value,
      extraData: mode,
    });
  }

  /**
   *@param {string} value the value for the qr "ABC"
   *@param {number} size Pixel size to use. Must be 1-16 (default 3)
   *@param {QrModes} model qr model "QR_MODEL_2" DEFAULT
   */
  public qrCode(value: string, size?: number, model?: QrModes): void {
    this.results.push({
      type: PrinterActionsTypes.qrCode,
      payload: {
        content: value,
        size: size ?? 3,
        model: model ?? QrModes.QR_MODEL_2,
      },
    });
  }

  /**
   * The feed function in TypeScript adds a new item to the results array with a specified value and
   * type.
   * @param {number} value - The `value` parameter in the `feed` method represents the number of units to
   * feed in the printer. This value will be stored in the `payload` property of the object pushed into
   * the `results` array with the type `PrinterActionsTypes.feed`.
   */
  public feed(value?: number): void {
    this.results.push({
      type: PrinterActionsTypes.feed,
      payload: value ?? undefined,
    });
  }

  public setEmphasis(value: boolean): void {
    this.results.push({
      type: PrinterActionsTypes.setEmphasis,
      payload: value,
    });
  }

  public cut(): void {
    this.results.push({
      type: PrinterActionsTypes.cut,
    });
  }

  public close(): void {
    this.results.push({
      type: PrinterActionsTypes.close,
    });
  }

  public async print(): Promise<{ success: boolean }> {
    const url: string = "http://localhost:8000/print";
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          key: this.key,
          printer: this.printerName,
          payload: this.results,
          textSpecial: this.textSpecial,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to print");
      } else {
        return {
          success: true,
        };
      }
    } catch (error) {
      throw new Error("Failed to print");
    }
  }

  public async getPrinters(): Promise<string[] | []> {
    const url: string = "http://localhost:8000/printers";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed getting printer list");
      } else {
        const printersData = await response.json();
        return printersData;
      }
    } catch (error) {
      throw new Error("Failed getting printer list");
    }
  }
}

type PrinterActions = {
  type: PrinterActionsTypes;
  payload?: PrinterPayloadType;
  extraData?: PrinterPayloadType;
};

enum PrinterActionsTypes {
  qrCode = "qrCode",
  barcode = "barcode",
  print = "print",
  commands = "commands",
  text = "text",
  textAsian = "textAsian",
  justify = "justify",
  printBase64Image = "printBase64Image",
  selectPrintMode = "selectPrintMode",
  cut = "cut",
  setEmphasis = "setEmphasis",
  feed = "feed",
  pulse = "pulse",
  close = "close",
}

export enum JustifyModes {
  justifyCenter = "justifyCenter",
  justifyLeft = "justifyLeft",
  justifyRight = "justifyRight",
}

export enum QrModes {
  QR_MODEL_1 = "QR_MODEL_1",
  QR_MODEL_2 = "QR_MODEL_2",
  QR_MICRO = "QR_MICRO",
}

export enum BarcodeModes {
  BARCODE_UPCA = "BARCODE_UPCA",
  BARCODE_UPCE = "BARCODE_UPCE",
  BARCODE_JAN13 = "BARCODE_JAN13",
  BARCODE_JAN8 = "BARCODE_JAN8",
  BARCODE_CODE39 = "BARCODE_CODE39",
  BARCODE_ITF = "BARCODE_ITF",
  BARCODE_CODABAR = "BARCODE_CODABAR",
}

export enum PrinterImagesModes {
  IMG_DEFAULT = "IMG_DEFAULT",
  IMG_DOUBLE_HEIGHT = "IMG_DOUBLE_HEIGHT",
  IMG_DOUBLE_WIDTH = "IMG_DOUBLE_WIDTH",
}

export enum PrinterModes {
  MODE_DOUBLE_WIDTH = "MODE_DOUBLE_WIDTH",
  MODE_DOUBLE_HEIGHT = "MODE_DOUBLE_HEIGHT",
  MODE_EMPHASIZED = "MODE_EMPHASIZED",
  MODE_FONT_A = "MODE_FONT_A",
  MODE_FONT_B = "MODE_FONT_B",
  MODE_UNDERLINE = "MODE_UNDERLINE",
}

type PrinterPayloadType =
  | PrinterImagesModes
  | PrinterModes
  | string
  | number
  | boolean
  | {
      content: string;
      size?: number;
      model?: QrModes;
    };

export default Printer;
