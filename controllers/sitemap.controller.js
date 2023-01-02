const fs = require("fs");
const path = require('path')
const axios = require("axios");

module.exports = {
    write: async (req, res) => {
        try {
            let arrayIds = [];
            let arrayIds2 = [];
            let arrayIds3 = [];

            //tests
            let page = 1;
            const {data} = await axios.get(`https://api.skilliant.net/api/tests?pagination[page]=${page}&pagination[pageSize]=100`);

            if (data.meta?.pagination?.pageCount) {
                for (page; page <= data.meta?.pagination?.pageCount; page++) {
                    const {data} = await axios.get(`https://api.skilliant.net/api/tests?pagination[page]=${page}&pagination[pageSize]=100`);
                    for (const obj of data.data) {
                        arrayIds.push(obj.id);
                    }


                }
            }
            //code-tests
            let page2 = 1;
            const response_1 = await axios.get(`https://api.skilliant.net/api/code-tests?pagination[page]=${page2}&pagination[pageSize]=10`);

            if (response_1.data.meta?.pagination?.pageCount) {
                for (page2; page2 <= response_1.data.meta?.pagination?.pageCount; page2++) {
                    const axiosResponse = await axios.get(`https://api.skilliant.net/api/code-tests?pagination[page]=${page2}&pagination[pageSize]=100`);
                    for (const value of axiosResponse.data.data) {
                        arrayIds3.push(value.id)
                    }
                }
            }

            //tech-name
            const response = await axios.get("https://api.skilliant.net/api/tech-names?pagination[pageSize]=100");
            for (const value of response?.data?.data) {
                arrayIds2.push(value.id)
            }

            let htmlMarkup = '';
            let htmlMarkup2 = '';
            let htmlMarkup3 = '';

            let lastmod = new Date(Date.now()).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            await arrayIds.forEach(id => {
                let url = `https://skilliant.net/test/${id}`;
                let changefreq = 'daily';
                let priority = '0.7';
                htmlMarkup += `<url>
                                <loc>${url}</loc>
                                <lastmod>${lastmod}</lastmod>
                                <changefreq>${changefreq}</changefreq>
                                <priority>${priority}</priority>
                            </url>`;
            });

            await arrayIds2.forEach(id => {
                let url = `https://skilliant.net/test-list/${id}`;
                let changefreq = 'daily';
                let priority = '0.7';
                htmlMarkup2 += `<url>
                                <loc>${url}</loc>
                                <lastmod>${lastmod}</lastmod>
                                <changefreq>${changefreq}</changefreq>
                                <priority>${priority}</priority>
                            </url>`;
            });

            await arrayIds3.forEach(id => {
                let url = `https://skilliant.net/code-test/${id}`;
                let changefreq = 'daily';
                let priority = '0.7';
                htmlMarkup3 += `<url>
                                <loc>${url}</loc>
                                <lastmod>${lastmod}</lastmod>
                                <changefreq>${changefreq}</changefreq>
                                <priority>${priority}</priority>
                            </url>`;
            });


            let xml = htmlMarkup += htmlMarkup2 += htmlMarkup3;

            let body = `
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
        <loc>https://skilliant.net/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>\n
${xml}  
    <url>
        <loc>https://skilliant.net/team-coding/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
    </url>    
    <url>
        <loc>https://skilliant.net/mentors/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://skilliant.net/compiler/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://skilliant.net/donation/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.4</priority>
    </url>
    <url>
        <loc>https://skilliant.net/for-users/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.4</priority>
    </url>
    <url>
        <loc>https://skilliant.net/learning-plan/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.4</priority>
    </url>
</urlset>
        `
            let file = path.join(process.cwd(), 'sitemap', 'sitemap.xml');

            await fs.writeFileSync(file, body);
            res.status(200).json("sitemap.xml file updated")

        } catch (e) {
            res.status(400).json(e.message);
        }

    }
}
