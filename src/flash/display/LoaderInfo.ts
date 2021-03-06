/**
 * Copyright 2014 Mozilla Foundation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Class: LoaderInfo
module Shumway.AVM2.AS.flash.display {
  import assert = Shumway.Debug.assert;
  import notImplemented = Shumway.Debug.notImplemented;
  import somewhatImplemented = Shumway.Debug.somewhatImplemented;
  import asCoerceString = Shumway.AVM2.Runtime.asCoerceString;

  import SWFFile = Shumway.SWF.SWFFile;
  import SWFFrame = Shumway.SWF.SWFFrame;

  export class LoaderInfo extends flash.events.EventDispatcher {

    // Called whenever the class is initialized.
    static classInitializer: any = null;

    // Called whenever an instance of the class is initialized.
    static initializer: any = null;

    // List of static symbols to link.
    static classSymbols: string [] = null; // [];

    // List of instance symbols to link.
    static instanceSymbols: string [] = null; // ["parameters", "uncaughtErrorEvents",
                                              // "dispatchEvent"];

    // Constructing LoaderInfo without providing this token throws, preventing it from AS3.
    static CtorToken = {};
    constructor (token: Object) {
      false && super();
      if (token !== LoaderInfo.CtorToken) {
        throwError('ArgumentError', Errors.CantInstantiateError, 'LoaderInfo$');
      }
      flash.events.EventDispatcher.instanceConstructorNoInitialize.call(this);
      this._loader = null;
      this._loaderUrl = '';
      this.reset();
    }

    reset() {
      this._url = '';
      this._file = null;
      this._bytesLoaded = 0;
      this._bytesTotal = 0;
      this._applicationDomain = null;
      this._parameters = null;
      this._width = 0;
      this._height = 0;
      this._sharedEvents = null;
      this._parentSandboxBridge = null;
      this._childSandboxBridge = null;
      this._content = null;
      this._bytes = null;
      this._uncaughtErrorEvents = null;
      this._allowCodeExecution = true;
      this._dictionary = [];
      this._abcBlocksLoaded = 0;
      this._mappedSymbolsLoaded = 0;
      this._fontsLoaded = 0;
      this._avm1Context = null;
    }

    setFile(file: any /* SWFFile | ImageFile */) {
      release || assert(!this._file);
      this._file = file;
      this._bytesTotal = file.bytesTotal;
      if (file instanceof SWFFile) {
        // TODO: remove these duplicated fields from LoaderInfo.
        var bbox = file.bounds;
        this._width = bbox.xMax - bbox.xMin;
        this._height = bbox.yMax - bbox.yMin;
      } else {
        release || assert(file instanceof ImageFile);
      }
    }

    static getLoaderInfoByDefinition(object: Object): flash.display.LoaderInfo {
      object = object;
      notImplemented("public flash.display.LoaderInfo::static getLoaderInfoByDefinition"); return;
    }

    _url: string;
    _loaderUrl: string;
    _file: any /* SWFFile|ImageFile*/;
    _bytesLoaded: number /*uint*/;
    _bytesTotal: number /*uint*/;
    _applicationDomain: flash.system.ApplicationDomain;
    _parameters: Object;
    _width: number /*int*/;
    _height: number /*int*/;
    _sharedEvents: flash.events.EventDispatcher;
    _parentSandboxBridge: Object;
    _childSandboxBridge: Object;
    _loader: flash.display.Loader;
    _content: flash.display.DisplayObject;
    _bytes: flash.utils.ByteArray;
    _abcBlocksLoaded: number;
    _mappedSymbolsLoaded: number;
    _fontsLoaded: number;
    _uncaughtErrorEvents: flash.events.UncaughtErrorEvents;

    /**
     * Use this to ignore any user code.
     */
    _allowCodeExecution: boolean;

    _dictionary: Shumway.Timeline.Symbol [];
    _avm1Context: Shumway.AVM1.AVM1Context;

    get loaderURL(): string {
      if (!this._loader) {
        // For the instance of the main class of the SWF file, this URL is the
        // same as the SWF file's own URL.

        // The loaderURL value can be changed by player settings.
        var service: IRootElementService = Shumway.AVM2.Runtime.AVM2.instance.globals['Shumway.Player.Utils'];
        return (this._url === service.swfUrl && service.loaderUrl) || this._url;
      }
      return this._loaderUrl;
    }

    get url(): string {
      if (!this._file) {
        return null;
      }
      return this._url;
    }

    get isURLInaccessible(): boolean {
      somewhatImplemented("public flash.display.LoaderInfo::get isURLInaccessible");
      return this._file ? false : true;
    }

    get bytesLoaded(): number /*uint*/ {
      return this._bytesLoaded;
    }

    get bytesTotal(): number /*uint*/ {
      return this._bytesTotal;
    }

    get applicationDomain(): flash.system.ApplicationDomain {
      somewhatImplemented("public flash.display.LoaderInfo::get applicationDomain");
      return this._file ? flash.system.ApplicationDomain.currentDomain : null;
      // return this._applicationDomain;
    }

    get swfVersion(): number /*uint*/ {
      if (!this._file) {
        throwError('Error', Errors.LoadingObjectNotInitializedError);
      }
      if (!(this._file instanceof SWFFile)) {
        throwError('Error', Errors.LoadingObjectNotSWFError);
      }
      return this._file.swfVersion;
    }

    get actionScriptVersion(): number /*uint*/ {
      if (!this._file) {
        throwError('Error', Errors.LoadingObjectNotInitializedError);
      }
      if (!(this._file instanceof SWFFile)) {
        throwError('Error', Errors.LoadingObjectNotSWFError);
      }
      return this._file.useAVM1 ?
             ActionScriptVersion.ACTIONSCRIPT2 :
             ActionScriptVersion.ACTIONSCRIPT3;
    }

    get frameRate(): number {
      if (!this._file) {
        throwError('Error', Errors.LoadingObjectNotInitializedError);
      }
      if (!(this._file instanceof SWFFile)) {
        throwError('Error', Errors.LoadingObjectNotSWFError);
      }
      return this._file.frameRate;
    }

    get width(): number /*int*/ {
      if (!this._file) {
        throwError('Error', Errors.LoadingObjectNotInitializedError);
      }
      return (this._width / 20) | 0;
    }

    get height(): number /*int*/ {
      if (!this._file) {
        throwError('Error', Errors.LoadingObjectNotInitializedError);
      }
      return (this._height / 20) | 0;
    }

    get contentType(): string {
      if (!this._file) {
        return null;
      }
      return this._file instanceof ImageFile ?
             this._file.mimeType :
             'application/x-shockwave-flash';
    }

    get sharedEvents(): flash.events.EventDispatcher {
      somewhatImplemented("public flash.display.LoaderInfo::get sharedEvents");
      if (!this._sharedEvents) {
        this._sharedEvents = new flash.events.EventDispatcher();
      }
      return this._sharedEvents;
    }
    get parentSandboxBridge(): Object {
      somewhatImplemented("public flash.display.LoaderInfo::get parentSandboxBridge");
      return this._parentSandboxBridge;
    }
    set parentSandboxBridge(door: Object) {
      somewhatImplemented("public flash.display.LoaderInfo::set parentSandboxBridge");
      this._parentSandboxBridge = door;
    }
    get childSandboxBridge(): Object {
      somewhatImplemented("public flash.display.LoaderInfo::get childSandboxBridge");
      return this._childSandboxBridge;
    }
    set childSandboxBridge(door: Object) {
      somewhatImplemented("public flash.display.LoaderInfo::set childSandboxBridge");
      this._childSandboxBridge = door;
    }
    get sameDomain(): boolean {
      if (!this._file) {
        throwError('Error', Errors.LoadingObjectNotInitializedError);
      }
      somewhatImplemented("public flash.display.LoaderInfo::get sameDomain");
      return true;
    }
    get childAllowsParent(): boolean {
      if (!this._file) {
        throwError('Error', Errors.LoadingObjectNotInitializedError);
      }
      somewhatImplemented("public flash.display.LoaderInfo::get childAllowsParent");
      return true;
    }
    get parentAllowsChild(): boolean {
      if (!this._file) {
        throwError('Error', Errors.LoadingObjectNotInitializedError);
      }
      somewhatImplemented("public flash.display.LoaderInfo::get parentAllowsChild");
      return true;
    }

    get loader(): flash.display.Loader {
      return this._loader;
    }

    get content(): flash.display.DisplayObject {
      return this._loader && this._loader.content;
    }

    get bytes(): flash.utils.ByteArray {
      if (!this._file) {
        return new flash.utils.ByteArray();
      }
      notImplemented("public flash.display.LoaderInfo::get bytes");
      return null;
    }
    get parameters(): Object {
      somewhatImplemented("public flash.display.LoaderInfo::get parameters");
      if (this._parameters) {
        return Shumway.ObjectUtilities.cloneObject(this._parameters);
      }
      return {};
    }
    get uncaughtErrorEvents(): flash.events.UncaughtErrorEvents {
      somewhatImplemented("public flash.display.LoaderInfo::_getUncaughtErrorEvents");
      if (!this._uncaughtErrorEvents) {
        this._uncaughtErrorEvents = new events.UncaughtErrorEvents();
      }
      return this._uncaughtErrorEvents;
    }

    // TODO: activate this override while keeping the ability to dispatch events from TS.
    //dispatchEvent(event: events.Event): boolean {
    //  // TODO: this should be `IllegalOperationError`, but we don't include that class.
    //  throwError('Error', Errors.InvalidLoaderInfoMethodError);
    //  return false;
    //}

    getSymbolResolver(classDefinition: ASClass, symbolId: number): () => any {
      return this.resolveClassSymbol.bind(this, classDefinition, symbolId);
    }

    getSymbolById(id: number): Shumway.Timeline.Symbol {
      var symbol = this._dictionary[id];
      if (symbol) {
        if (symbol.ready === false) {
          // We cannot assert this, as content might invalidly access symbols that aren't available
          // yet.
          release || Debug.warning("Accessing symbol that's not yet ready.");
          return null;
        }
        return symbol;
      }
      release || assert(this._file instanceof SWFFile);
      var data = this._file.getSymbol(id);
      if (!data) {
        if (id !== 65535) {
          // Id 65535 is somehow used invalidly in lots of embedded shapes created by the authoring
          // tool.
          Debug.warning("Unknown symbol requested: " + id);
        }
        // It's entirely valid not to have symbols defined, but might be a sign of us doing
        // something wrong in parsing.
        return null;
      }
      // TODO: replace this switch with a table lookup.
      switch (data.type) {
        case 'shape':
          symbol = flash.display.ShapeSymbol.FromData(data, this);
          break;
        case 'morphshape':
          symbol = flash.display.MorphShapeSymbol.FromData(data, this);
          break;
        case 'image':
          if (data.definition) {
            data = data.definition;
          }
          symbol = flash.display.BitmapSymbol.FromData(data);
          break;
        case 'label':
          symbol = flash.text.TextSymbol.FromLabelData(data, this);
          break;
        case 'text':
          symbol = flash.text.TextSymbol.FromTextData(data, this);
          this._syncAVM1Attributes(symbol);
          break;
        case 'button':
          symbol = flash.display.ButtonSymbol.FromData(data, this);
          this._syncAVM1Attributes(symbol);
          break;
        case 'sprite':
          symbol = flash.display.SpriteSymbol.FromData(data, this);
          break;
        case 'font':
          // Fonts are eagerly parsed and have their data in `definition`.
          if (data.definition) {
            data = data.definition;
          }
          symbol = flash.text.FontSymbol.FromData(data);
          var font = flash.text.Font.initializeFrom(symbol);
          flash.text.Font.instanceConstructorNoInitialize.call(font);
          break;
        case 'sound':
          symbol = flash.media.SoundSymbol.FromData(data);
          break;
        case 'binary':
          symbol = Timeline.BinarySymbol.FromData(data);
          break;
      }
      release || assert(symbol, "Unknown symbol type " + data.type);
      this._dictionary[id] = symbol;
      if (symbol.ready === false) {
        this._registerFontOrImage(<Timeline.EagerlyResolvedSymbol><any>symbol, data);
      }
      return symbol;
    }

    private _registerFontOrImage(symbol: Timeline.EagerlyResolvedSymbol, data: any) {
      var resolver: Timeline.IAssetResolver = AVM2.Runtime.AVM2.instance.globals['Shumway.Player.Utils'];
      switch (data.type) {
        case 'font':
          resolver.registerFont(<Timeline.EagerlyResolvedSymbol><any>symbol, data);
          break;
        case 'image':
          resolver.registerImage(<Timeline.EagerlyResolvedSymbol><any>symbol, data);
          break;
        default:
          throw new Error('Unsupported assert type: ' + data.type);
      }
    }

    getRootSymbol(): flash.display.SpriteSymbol {
      release || assert(this._file instanceof SWFFile);
      release || assert(this._file.framesLoaded > 0);
      var symbol = <flash.display.SpriteSymbol>this._dictionary[0];
      if (!symbol) {
        symbol = new flash.display.SpriteSymbol({id: 0, className: this._file.symbolClassesMap[0]},
                                                this);
        symbol.isRoot = true;
        symbol.numFrames = this._file.frameCount;
        this._syncAVM1Attributes(symbol);
        this._dictionary[0] = symbol;
      }
      return symbol;
    }

    private _syncAVM1Attributes(symbol: Timeline.Symbol) {
      if (this.actionScriptVersion === ActionScriptVersion.ACTIONSCRIPT2) {
        symbol.isAVM1Object = true;
        symbol.avm1Context = this._avm1Context;
      }
    }

    // TODO: Frames should be parsed lazily when they're first needed, and this removed.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1114656
    getFrame(sprite: {frames: SWFFrame[]}, index: number): SWFFrame {
      var file = this._file;
      release || assert(file instanceof SWFFile);
      if (!sprite) {
        sprite = file;
      }
      return sprite.frames[index];
    }

    // TODO: To prevent leaking LoaderInfo instances, those instances should be stored weakly,
    // with support for retrieving the instances based on a numeric id, which would be passed here.
    private resolveClassSymbol(classDefinition: ASClass, symbolId: number) {
      var symbol = this.getSymbolById(symbolId);
      if (!symbol) {
        Debug.warning("Attempt to resolve symbol for AVM2 class failed: Symbol " +
                      symbolId + " not found.");
      } else {
        Object.defineProperty(classDefinition, "defaultInitializerArgument", {value: symbol});
        return symbol;
      }
    }
  }

  export interface IRootElementService {
    pageUrl: string;
    swfUrl: string;
    loaderUrl: string;
  }
}
