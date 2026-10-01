export function ConnectionForm({
  credentials,
  recipient,
  onCredentialsChange,
  onRecipientChange,
  onSubmit,
}) {
  function updateCredential(field, value) {
    onCredentialsChange({ ...credentials, [field]: value });
  }
  return (
    <form className="credentials" onSubmit={onSubmit}>
      <label>
        idInstance
        <input
          value={credentials.idInstance}
          onChange={(event) =>
            updateCredential("idInstance", event.target.value)
          }
          placeholder="1101…"
          inputMode="numeric"
        />
      </label>
      <label>
        apiTokenInstance
        <input
          value={credentials.token}
          onChange={(event) => updateCredential("token", event.target.value)}
          placeholder="Ваш токен API"
          type="password"
        />
      </label>
      <label>
        Номер получателя / chatId
        <input
          value={recipient}
          onChange={(event) => onRecipientChange(event.target.value)}
          placeholder="10000000"
        />
      </label>
      <button className="primary-button" type="submit">
        Открыть чат <span>→</span>
      </button>
    </form>
  );
}
