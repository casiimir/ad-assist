import { useState } from "react";
import OpenAI from "openai";
import useImageUpload from '../hooks/useImageUpload'
import { MdOutlineCameraAlt } from "react-icons/md";
import Spinner from '../components/spinner'
import styles from "@/styles/Home.module.scss";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_APIKEY, dangerouslyAllowBrowser: true });

type ProductInfo = {
  title: string;
  price: string;
  description: string;
};

export default function Home() {
  const [titleValue, setTitleValue] = useState<string>("")
  const [priceValue, setPriceValue] = useState<string>("")
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [productOptions, setProductOptions] = useState<string>("")

  const [render, setRender] = useState("form");

  const { imageBase64, setImageBase64, handleImageChange } = useImageUpload();

  const onHandleSubmit = (e: any) => {
    e.preventDefault();

    setRender('loading');

    openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 250,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Utilizzando le immagini fornite, in italiano, crea una inserzione di vendita come se la scrivesse un utente medio e formatta i dettagli in un oggetto JSON. Il JSON deve includere solo: title (${titleValue}), fai un check sul titolo se affidabile, price (${priceValue}) e description mediamente approfondita che metta in risalto lo stato dell'articolo, le sue caratteristiche chiave come ${productOptions} (e contestualizza), raccontati sulla base della immagine fornita. Dovrebbe anche includere informazioni sulle condizioni dell'articolo, sempre basandoci sulla immagine. Ricorda che il risultato finale deve essere unicamente un oggetto JSON ben strutturato, senza alcuna formattazione aggiuntiva o commenti esterni al JSON stesso.` },
            {
              type: "image_url",
              image_url: {
                "url": `${imageBase64}`,
              },
            },
          ]
        },
      ],
    }).then((response: any) => {
      setProductInfo(JSON.parse(response.choices[0].message.content.replace(/`|\n/g, '').trim().replace('json', '')))
      setRender('product');
    })
  }

  const onHandleNewAds = () => {
    setImageBase64('');
    setRender('form');
  }

  switch (render) {
    case 'form':
      return (
        <main className={styles.main}>
          <div className={styles.header}>
            <h1>SnapAI</h1>
            <p>Scatta la tua foto e crea il tuo annuncio! Sentiti libero di compilare i campi per aggiungere maggiori informazioni.</p>
          </div>
          <form className={styles.form} onSubmit={onHandleSubmit}>
            <div className={styles.photoArea}>
              <label htmlFor="file" className={styles.customFileUpload}>
                <MdOutlineCameraAlt className={styles.cameraIcon} />
              </label>
              <input id="file" type="file" accept="image/*" onChange={handleImageChange} required />
              {imageBase64 && <img className={styles.image} src={imageBase64} alt="Preview" />}
            </div>
            <label htmlFor="title">Titolo</label>
            <input id="title" type="text" placeholder="Qui va il titolo dell'annuncio!" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />
            <label htmlFor="price">Prezzo</label>
            <input id="price" type="text" placeholder="Qui invece va il prezzo che preferisci!" value={priceValue} onChange={(e) => setPriceValue(e.target.value)} />
            <label htmlFor="info">Maggiori info</label>
            <textarea id="info" rows={5} placeholder="Se vuoi rendere ancora più dettagliato l'annuncio, aggiungi tutti i dettagli qui!" value={productOptions} onChange={(e) => setProductOptions(e.target.value.replaceAll('\n', ' '))}></textarea>
            <input type="submit" value="Genera!" />
          </form>
        </main>

      )
    case 'product':
      return (
        <div className={styles.product}>
          <img className={styles.image} src={imageBase64} alt={titleValue || 'ad-name'} />
          <h1>{productInfo?.title}</h1>
          <div className={styles.heading}>
            <h3>Descrizione</h3>
            <span className={styles.price}>{productInfo?.price}</span>
          </div>
          <p className={styles.description}>{productInfo?.description}</p>
          <button onClick={onHandleNewAds}>Nuovo Annuncio</button>
        </div>
      )
    case 'loading':
      return <Spinner />;
  }
}
