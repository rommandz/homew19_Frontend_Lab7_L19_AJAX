function getJSON(url) {
    return new Promise(function(resolve, reject) {
        var res;
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.onload = function() {
            if (this.readyState == 4 && this.status == 200) {
                res = JSON.parse(this.responseText);
                resolve(res);
            } else {
                reject(new Error(`${this.status}: ${this.statusText}`));
            }
        };
        req.onerror = function() {
            reject(new Error("Network Error"));
        };
        req.send();
    });
}
