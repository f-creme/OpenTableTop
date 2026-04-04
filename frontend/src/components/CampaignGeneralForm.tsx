import type { FC } from "react";
import { Pen } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
    campaignTitle: string;
    setCampaignTitle: (title: string) => void;
    localPublicName: string;
    setLocalPublicName: (name: string) => void;
    disabledEditGlobal: boolean;
    setDisabledEditGlobal: (b: boolean) => void;
    onSave: () => void;
    isNewCampaign: boolean;
};

const CampaignGeneralForm: FC<Props> = ({
    campaignTitle,
    setCampaignTitle,
    localPublicName,
    setLocalPublicName,
    disabledEditGlobal,
    setDisabledEditGlobal,
    onSave,
    isNewCampaign
}) => {
    const { t } = useTranslation()
    return (
        <div className="flex flex-col">
            <p className="text-4xl text-center font-semibold p-5 mb-5">{t("component.campaign-general-form.title")}</p>
            {isNewCampaign && (
                <p className="bg-info/10 rounded-md text-info p-4 mb-4">
                    {t("component.campaign-general-form.info")}
                </p>
            )}
            <fieldset className="fieldset w-full mb-4">
                <legend className="fieldset-legend text-xl">{t("component.campaign-general-form.fields.title")}</legend>
                <input 
                    type="text"
                    className="input input-xl w-full"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    disabled={disabledEditGlobal}
                />
            </fieldset>

            <fieldset>
                <legend className="fieldset-legend">{t("component.campaign-general-form.fields.name")}</legend>
                <input 
                    type="text"
                    className="input input-md w-full"
                    value={localPublicName}
                    onChange={(e) => setLocalPublicName(e.target.value)}
                    disabled={disabledEditGlobal}
                />
            </fieldset>

            <div className="flex flex-row-reverse mt-5 gap-5">
                <button
                    className="btn btn-success text-success-content p-3"
                    disabled={disabledEditGlobal}
                    onClick={onSave}
                >
                    {t("component.campaign-general-form.button.save")}
                </button>
                <button
                    className={`btn btn-circle ${!disabledEditGlobal ? "btn-primary btn-soft" : ""}`}
                    onClick={() => setDisabledEditGlobal(!disabledEditGlobal)}
                >
                    <Pen />
                </button>
            </div>
        </div>
    );
};

export default CampaignGeneralForm;