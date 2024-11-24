import { NavLink } from "react-router-dom";
import SecretInput from "../components/Secrets/SecretInput";
import SecretList from "../components/Secrets/SecretList";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-10 my-20">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/logout"
              className="w-full mt-4 p-4 bg-[#18181B] hover:bg-[#2c2c31] text-white py-2 rounded-md "
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
      <section className="py-12 pt-3 md:pd-12 lg:py-10">
        <SecretInput />
      </section>
      <section className="w-full py-12 bg-gray-100 pt md:pd-12 lg:py-10 ">
        <SecretList />
      </section>
    </div>
  );
}
