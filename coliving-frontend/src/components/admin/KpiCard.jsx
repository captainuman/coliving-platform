import { Card, CardContent } from "../ui/card";

const KpiCard = ({ title, value, subtitle, icon }) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>

            <h2 className="mt-2 text-3xl font-bold">
              {value ?? 0}
            </h2>

            {subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {icon && (
            <div className="rounded-xl bg-muted p-3 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
