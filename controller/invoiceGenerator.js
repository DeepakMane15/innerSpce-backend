
const fs = require('fs');
const puppeteer = require('puppeteer')
const handlebars = require('handlebars');
const path = require('path')

const generateInvoice = async (req, res) => {

    console.log("here");

    const { name } = req.body;

    const customerName = name || 'John Doe';

    try {

        const host = req.headers.host;
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        // return `${protocol}://${host}/images/${relativePath}`;

        const logo = `${protocol}://${host}/images/Picture.png`;
        const tline = `${protocol}://${host}/images/tline.png`;
        const kb = `${protocol}://${host}/images/kb.png`;

        console.log(logo);
        // read our invoice-template.html file using node fs module
        const file = fs.readFileSync('./views/invoice-template.html', 'utf8');

        // console.log(file);

        // return;

        const template = handlebars.compile(file);

        const html = template({ customerName, logo, tline, kb });

        // simulate a chrome browser with puppeteer and navigate to a new page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        

        // set our compiled html template as the pages content
        // then waitUntil the network is idle to make sure the content has been loaded
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // convert the page to pdf with the .pdf() method
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        // send the result to the client
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        res.send(pdf);

    }
    catch (err) {
        console.log(err)
        res.send({ status: 400, message: err, process: "generateInvoice" })
    }
}


function generateFullImagePath(req, imageName) {
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    return `${protocol}://${host}/images/${imageName}`;
}

module.exports = { generateInvoice };
