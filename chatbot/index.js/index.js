const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: "org-hREGtrQL7bCUJQM31bpuyhBh",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

async function callApi() {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Say this is a test",
        max_tokens: 7,
        temperature: 0,
      });
    console.log(reponse.data.choices)
}

callApi()