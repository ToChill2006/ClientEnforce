// Server component — inlined in <head> before hydration to avoid theme flash.
export function ThemeScript() {
  const code = `
(function(){try{
  var s = localStorage.getItem('ce-theme');
  var t = s === 'dark' || s === 'light' ? s : 'light';
  document.documentElement.setAttribute('data-theme', t);
}catch(e){document.documentElement.setAttribute('data-theme','light');}})();
`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
