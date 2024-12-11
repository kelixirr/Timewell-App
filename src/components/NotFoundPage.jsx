import styles from "./NotFoundPage.module.css"

export default function NotFoundPage() {
  return (
    <>
      <div className={styles.NotFoundPage}>
        The Page You Are Looking For Does Not Exist :(
        <br /> Please try something else or reach out to us in case you are
        facing any issue.
      </div>
    </>
  );
}
