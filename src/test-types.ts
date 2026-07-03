import { supabase } from "./integrations/supabase/client";

async function test() {
  const { data } = await supabase.from("accounts").select("*");
  console.log(data);
}
