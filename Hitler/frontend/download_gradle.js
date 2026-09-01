import https from 'https';
import fs from 'fs';
import path from 'path';

const fileUrl = 'https://services.gradle.org/distributions/gradle-8.14.3-all.zip';
const dest = 'C:\\Users\\Umid\\.gradle\\wrapper\\dists\\gradle-8.14.3-all\\ekfifczy39xxeqqqzobqh30ld\\gradle-8.14.3-all.zip';

const dir = path.dirname(dest);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const file = fs.createWriteStream(dest);
https.get(fileUrl, function(response) {
    response.pipe(file);
    file.on('finish', function() {
        file.close(() => {
            console.log("Download complete!");
        });
    });
}).on('error', function(err) {
    fs.unlink(dest, () => {});
    console.error("Error downloading file:", err);
});
