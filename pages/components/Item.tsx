import styles from "../../styles/Home.module.css"
import Image from "next/image"


export default function Item(props:any) {

    return (
        <div className={styles.item}>
            <Image src="/sample.jpg" width={250} height={250} alt='sample' />
            <header>
                <p>{props.name}</p>
                <h3>&#8377; {props.price}</h3>
            </header>
        </div>
    )

}

