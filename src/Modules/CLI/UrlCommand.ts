import BunqCLI from "../../BunqCLI";
import { CommandLineBunqCLIModule } from "../../Types/BunqCLIModule";

import FilterParser from "../../InputHandlers/FilterParser";
import UrlParser from "../../InputHandlers/UrlParser";
import DataParser from "../../InputHandlers/DataParser";
import MethodParser from "../../InputHandlers/MethodParser";

import EndpointUrlYargsHelper from "../../Yargs/EndpointUrlYargsHelper";

const handle = async (bunqCLI: BunqCLI) => {
    const bunqJSClient = bunqCLI.bunqJSClient;
    const argv = bunqCLI.argv;

    await bunqCLI.getUser(true);
    await bunqCLI.getMonetaryAccounts(true);

    const parsedMethod = MethodParser(argv.method, bunqCLI);
    const method = parsedMethod === "LIST" ? "GET" : parsedMethod;
    const urlInput = bunqCLI.cliCommands[1];
    const data = DataParser(argv.data, bunqCLI);
    const url = UrlParser(urlInput, bunqCLI);
    const params = FilterParser(bunqCLI);

    const result = await bunqJSClient.ApiAdapter.request(
        url,
        method,
        data,
        {},
        {
            axiosOptions: {
                params: params
            }
        }
    );

    bunqCLI.outputHandler(result.data);
};

const UrlCommand = new CommandLineBunqCLIModule();
UrlCommand.command = "url";
UrlCommand.message = "Call a specific url with the given parameters and data";
UrlCommand.handle = handle;
UrlCommand.yargsAdvanced = yargsInner => {
    // run the helper function
    return EndpointUrlYargsHelper(UrlCommand)(yargsInner);
};

export default UrlCommand;
