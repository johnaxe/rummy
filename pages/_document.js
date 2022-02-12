import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="manifest" href="/manifest.json" />
                    <link
                        rel="apple-touch-icon"
                        href="/icon-512x512.png"></link>
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/icon-512x512.png"
                    />
                    <meta name="theme-color" content="#1976d2" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
