import { Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInButton } from "@clerk/clerk-react";

function App() {
  const guests = useQuery(api.visitor.get);
  return (
    <main>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      {/* <Authenticated> */}
      {/* <UserButton /> */}
      {guests?.map((guest) => <>{guest.name}</>)}
      {/* </Authenticated> */}
    </main>
  );
}

export default App;
