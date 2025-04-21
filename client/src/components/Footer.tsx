import CONSTANTS from "@/constants/constants";

const Footer = () => {
  return (
    <footer className="bg-slate-100 py-2 w-full h-8 bottom-0 text-center text-xs tracking-wider">
      &copy; {CONSTANTS.SCHOOL} {new Date().getFullYear()}
    </footer>
  );
};

export default Footer;
