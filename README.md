# ESC-POS-PRINTER for Javascript / Typescript

#### IMPORTANT

#### To use this library, the use of the [ESC-POS Printer manager](https://escpos-printermanager.netlify.app/) is required.

### Installation

![npm](https://img.shields.io/npm/v/esc-pos-printer)
![npm](https://img.shields.io/npm/dt/esc-pos-printer)
![npm](https://img.shields.io/npm/l/esc-pos-printer)

```bash
npm install esc-pos-printer
# or
yarn add esc-pos-printer
```

## Example

See it live [escpos-printer-example.netlify.app](https://escpos-printer-example.netlify.app/)

[EXAMPLE SOURCE CODE](https://github.com/yayidg22/esc-pos-printer-react-vite/)

```javascript
import Printer from "esc-pos-printer";

const handlePrint = async () => {
  try {
    /* Create new printer  */
    const printer = new Printer();

    /* for japanese and chinese text
       const printer = new Printer(sharedPrinterName, { textAsian: true });
       or
       printer.setPrinterTextAsian(true);

       printer.text("こんにちは、これは機能します \n");
       printer.text("你好，这有效 \n");
    */

    /* for use unifont chars
       const printer = new Printer(sharedPrinterName, { textSpecial: true });
       or
       printer.setPrinterTextSpecial(true);
       
       printer.text("IT WORKS!!! :D\n");
       printer.text("Hola esto funciona\n");
       printer.text("Ողջույն, սա աշխատում է: \n");
       printer.text("こんにちは、これは機能します \n");
       printer.text("안녕하세요 이게 작동해요 \n");
       printer.text("你好，这有效 \n");
    */

    /* get Printers list  */
    const printerList = await printer.getPrinters();

    /* you can set the list in a state and use a select */
    /* printerList[0] for this example */
    printer.setPrinterName(printerList[0]);

    printer.text("IT WORKS!!! :D\n");
    printer.feed(2);
    printer.cut();
    printer.close();
    await printer.print();
  } catch (error) {
    /*  Handle error  */
  }
};
```

## Printer Class Documentation

The `Printer` class in TypeScript provides a structured interface for interacting with printers

### Class Overview

The `Printer` class encapsulates functionality to control and manage printing actions on a connected printer. It abstracts various printing operations into methods that generate a sequence of commands (`results`) to be executed by the printer.

### Constructor

#### `constructor(printerName?: string)`

- **Description**: Initializes a new instance of the `Printer` class.
- **Parameters**:
  - `printerName` (optional): A string representing the name or identifier of the printer.
- **Usage**:
  ```typescript
  const printer = new Printer("MyPrinter");
  ```

### Public methods

#### `getPrinters(): Promise<string[] | []>`

- **Description**: Retrieves a list of available printers.
- **Returns**: A promise resolving to an array of printer names.
- **Usage**:
  ```typescript
  const printerList = await printer.getPrinters();
  ```

#### `setPrinterName(printerName: string): void`

- **Description**: Sets the name of the printer.
- **Parameters**:
  - `printerName` : A string representing the name or identifier of the printer.
- **Usage**:
  ```typescript
  printer.setPrinterName("NewPrinterName");
  ```

#### `setPrinterTextAsian(value:boolean): void`

- **Description**:for more compatibility with asian characters compatible with some printers
- **Parameters**:
  - `value` : a boolean to enable or disable TextAsian
- **Usage**:
  ```typescript
  printer.setPrinterTextAsian(true);
  ```

#### `setPrinterTextSpecial(value:boolean): void` **EXPERIMENTAL**

- **Description**: The text rendered of this print instance is going to be printed as unifont
- **Parameters**:
  - `value` : a boolean to enable or disable TextSpecial
- **Usage**:
  ```typescript
  printer.setPrinterTextSpecial(true);
  ```

#### `selectPrintMode(mode?: PrinterModes): void`

- **Description**: Sets the print mode of the printer (e.g., font size, emphasis).
- **Parameters**:
  - `mode` (optional): A value from `PrinterModes` enum representing the desired print mode.
- **Usage**:
  ```typescript
  printer.selectPrintMode(PrinterModes.MODE_DOUBLE_WIDTH);
  ```

#### `justify(mode: JustifyModes): void`

- **Description**: Sets the text justification for printing.
- **Parameters**:
  - `mode`:A value from `JustifyModes` enum representing the desired text justification.
- **Usage**:
  ```typescript
  printer.justify(JustifyModes.justifyCenter);
  ```

#### `printBase64Image(imageBase64: string,imageMode?:PrinterImagesModes ): void`

- **Description**: Prints a Base64-encoded image.
- **Parameters**:
  - `imageBase64`:A string containing the Base64-encoded image data.
  - `imageMode (optional)`: the size of render image example: PrinterImagesModes.IMG_DOUBLE_WIDTH
- **Usage**:
  ```typescript
  printer.printBase64Image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."); // Example Base64 image
  ```

#### `text(text: string): void`

- **Description**: Adds text to the print queue.
- **Parameters**:
  - `text`:A string representing the text to print.
- **Usage**:
  ```typescript
  printer.text("Hello, world!");
  ```
  
#### `barcode(value: string,mode?: BarcodeModes): void`

- **Description**: Adds barcode to the print queue.
- **Parameters**:
  - `value`:A string representing the text for the barcode.
  - `mode?`:The barcode mode.
- **Usage**:
  ```typescript
  printer.barcode("ABC",BarcodeModes.BARCODE_CODE39);
  ```

#### `qrCode(value: string,size?: number, model?: QrModes): void`

- **Description**: Adds barcode to the print queue.
- **Parameters**:
  - `value`:A string representing the text for the qrCode.
  - `size`:Pixel size to use. Must be 1-16 (default 3)
  - `model?`:qr model "QR_MODEL_2" DEFAULT
- **Usage**:
  ```typescript
  printer.barcode("ABC",QrModes.QR_MODEL_2);
  ```

#### `feed(value?: number): void`

- **Description**: Feeds the paper in the printer.
- **Parameters**:
  - `value`(optional): The number of units to feed (default is 1 unit).
- **Usage**:
  ```typescript
  printer.feed(); // Feed one unit
  printer.feed(2); // Feed two units
  ```

#### `setEmphasis(value: boolean): void`

- **Description**: Sets emphasis (bold) mode for text.
- **Parameters**:
  - `value`: A boolean indicating whether to enable (true) or disable (false) emphasis.
- **Usage**:
  ```typescript
  printer.setEmphasis(true); // Enable emphasis
  ```

#### `cut(): void`

- **Description**: Initiates a paper cut action.
- **Usage**:
  ```typescript
  printer.cut();
  ```

#### `close(): void`

- **Description**: Closes the printer connection or finalizes printing.
- **Usage**:
  ```typescript
  printer.close();
  ```

#### `print(): Promise<{ success: boolean }>`

- **Description**: Sends the accumulated print commands to the printer.
- **Returns**: A promise resolving to an object `{ success: boolean }` upon successful printing.
- **Usage**:
  ```typescript
  await printer.print();
  ```

### Enums

#### `PrinterModes`

- **Description**: Enumerates various print modes (e.g., font settings, underline).
- **Values**:
  - `MODE_DOUBLE_WIDTH`
  - `MODE_DOUBLE_HEIGHT`
  - `MODE_EMPHASIZED`
  - `MODE_FONT_A`
  - `MODE_FONT_B`
  - `MODE_UNDERLINE`

#### `JustifyModes`

- **Description**: Enumerates text justification modes.
- **Values**:
  - `justifyCenter`
  - `justifyLeft`
  - `justifyRight`

### MIT license

Copyright (c) 2024 yayidg22

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
