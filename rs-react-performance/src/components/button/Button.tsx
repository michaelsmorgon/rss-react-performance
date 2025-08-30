import styles from './Button.module.css';

type Props = {
  children: React.ReactNode;
  small?: boolean;
  onClick: () => void;
};

export default function Button({ children, small, onClick }: Props) {
  return (
    <button
      className={`${styles.btn} ${small ? styles.small : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
