import React, { useMemo, createContext, useRef, useEffect, useState, useContext } from "react";
function useLoadGsiScript(options = {}) {
  const { nonce, onScriptLoadSuccess, onScriptLoadError } = options;
  const [scriptLoadedSuccessfully, setScriptLoadedSuccessfully] = useState(false);
  const onScriptLoadSuccessRef = useRef(onScriptLoadSuccess);
  onScriptLoadSuccessRef.current = onScriptLoadSuccess;
  const onScriptLoadErrorRef = useRef(onScriptLoadError);
  onScriptLoadErrorRef.current = onScriptLoadError;
  useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://accounts.google.com/gsi/client";
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.nonce = nonce;
    scriptTag.onload = () => {
      var _a;
      setScriptLoadedSuccessfully(true);
      (_a = onScriptLoadSuccessRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadSuccessRef);
    };
    scriptTag.onerror = () => {
      var _a;
      setScriptLoadedSuccessfully(false);
      (_a = onScriptLoadErrorRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadErrorRef);
    };
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [nonce]);
  return scriptLoadedSuccessfully;
}
const GoogleOAuthContext = createContext(null);
function GoogleOAuthProvider({ clientId, nonce, onScriptLoadSuccess, onScriptLoadError, children }) {
  const scriptLoadedSuccessfully = useLoadGsiScript({
    nonce,
    onScriptLoadSuccess,
    onScriptLoadError
  });
  const contextValue = useMemo(() => ({
    clientId,
    scriptLoadedSuccessfully
  }), [clientId, scriptLoadedSuccessfully]);
  return React.createElement(GoogleOAuthContext.Provider, { value: contextValue }, children);
}
function useGoogleOAuth() {
  const context = useContext(GoogleOAuthContext);
  if (!context) {
    throw new Error("Google OAuth components must be used within GoogleOAuthProvider");
  }
  return context;
}
function extractClientId(credentialResponse) {
  var _a;
  const clientId = (_a = credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.clientId) !== null && _a !== void 0 ? _a : credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.client_id;
  return clientId;
}
const containerHeightMap = { large: 40, medium: 32, small: 20 };
function GoogleLogin({ onSuccess, onError, useOneTap, promptMomentNotification, type = "standard", theme = "outline", size = "large", text, shape, logo_alignment, width, locale, click_listener, containerProps, ...props }) {
  const btnContainerRef = useRef(null);
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const promptMomentNotificationRef = useRef(promptMomentNotification);
  promptMomentNotificationRef.current = promptMomentNotification;
  useEffect(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!scriptLoadedSuccessfully)
      return;
    (_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.initialize({
      client_id: clientId,
      callback: (credentialResponse) => {
        var _a2;
        if (!(credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.credential)) {
          return (_a2 = onErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onErrorRef);
        }
        const { credential, select_by } = credentialResponse;
        onSuccessRef.current({
          credential,
          clientId: extractClientId(credentialResponse),
          select_by
        });
      },
      ...props
    });
    (_f = (_e = (_d = window === null || window === void 0 ? void 0 : window.google) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e.id) === null || _f === void 0 ? void 0 : _f.renderButton(btnContainerRef.current, {
      type,
      theme,
      size,
      text,
      shape,
      logo_alignment,
      width,
      locale,
      click_listener
    });
    if (useOneTap)
      (_j = (_h = (_g = window === null || window === void 0 ? void 0 : window.google) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h.id) === null || _j === void 0 ? void 0 : _j.prompt(promptMomentNotificationRef.current);
    return () => {
      var _a2, _b2, _c2;
      if (useOneTap)
        (_c2 = (_b2 = (_a2 = window === null || window === void 0 ? void 0 : window.google) === null || _a2 === void 0 ? void 0 : _a2.accounts) === null || _b2 === void 0 ? void 0 : _b2.id) === null || _c2 === void 0 ? void 0 : _c2.cancel();
    };
  }, [
    clientId,
    scriptLoadedSuccessfully,
    useOneTap,
    type,
    theme,
    size,
    text,
    shape,
    logo_alignment,
    width,
    locale
  ]);
  return React.createElement("div", { ...containerProps, ref: btnContainerRef, style: { height: containerHeightMap[size], ...containerProps === null || containerProps === void 0 ? void 0 : containerProps.style } });
}
const AuthLogin = ({
  clientId,
  scopes = ["https://www.googleapis.com/auth/gmail.readonly"],
  onSuccess,
  onError,
  className = ""
}) => {
  const handleSuccess = (response) => {
    onSuccess({
      ...response,
      scopes
    });
  };
  const handleError = () => {
    onError == null ? void 0 : onError("Authentication failed");
  };
  return /* @__PURE__ */ React.createElement("div", { className }, /* @__PURE__ */ React.createElement(GoogleOAuthProvider, { clientId }, /* @__PURE__ */ React.createElement(
    GoogleLogin,
    {
      onSuccess: handleSuccess,
      onError: handleError,
      useOneTap: false
    }
  )));
};
if (typeof window !== "undefined") {
  window.plugins = window.plugins || {};
  window.plugins["makyo-gmail"] = {
    AuthLogin
  };
}
export {
  AuthLogin
};
//# sourceMappingURL=index.js.map
